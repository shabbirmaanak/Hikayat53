import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import { createClient } from '@libsql/client';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

/**
 * Hikayat Excel & CSV Ingestion Script
 *
 * Supports 3-column format (id, title_arabic, text_arabic)
 * as well as full multi-column formats.
 */

const url = process.env.TURSO_DATABASE_URL || 'file:hikayat_local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

console.log(`Connecting to Turso/libSQL database at: ${url}`);
const db = createClient({ url, authToken });

function findExcelFile(): string | null {
  if (process.argv[2] && fs.existsSync(process.argv[2])) {
    return process.argv[2];
  }

  const commonNames = [
    'hikayat_114.xlsx',
    'hikayat.xlsx',
    'stories.xlsx',
    'hikayat_114.csv',
    'hikayat.csv',
    'hikayat_template.csv',
    'stories.csv',
  ];

  for (const name of commonNames) {
    if (fs.existsSync(name)) return name;
    if (fs.existsSync(path.join('data', name))) return path.join('data', name);
  }

  const files = fs.readdirSync(process.cwd());
  for (const f of files) {
    if (f.endsWith('.xlsx') || f.endsWith('.xls') || f.endsWith('.csv')) {
      if (!f.startsWith('~$')) return f;
    }
  }

  return null;
}

function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .trim()
    .replace(/[\s\-_]+/g, '');
}

function getColumnValue(row: Record<string, any>, possibleNames: string[]): any {
  const normalizedTargets = possibleNames.map((n) => normalizeKey(n));
  for (const key of Object.keys(row)) {
    const normKey = normalizeKey(key);
    if (normalizedTargets.includes(normKey)) {
      return row[key];
    }
  }
  return null;
}

function autoSegmentText(
  arabicText: string,
  englishText: string,
  totalDurationMs: number
): Array<{ segment_order: number; text_arabic: string; text_english: string; audio_start_ms: number; audio_end_ms: number }> {
  // Split Arabic by sentence punctuation or newlines
  const arSentences = arabicText
    .split(/(?<=[.!?؛؟\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const enSentences = englishText
    ? englishText
        .split(/(?<=[.!?\n])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const count = Math.max(arSentences.length, 1);
  const segmentDuration = Math.floor(totalDurationMs / count);

  const segments = [];
  for (let i = 0; i < count; i++) {
    const ar = arSentences[i] || arabicText;
    const en = enSentences[i] || (englishText ? englishText : `Segment ${i + 1}`);
    const startMs = i * segmentDuration;
    const endMs = i === count - 1 ? totalDurationMs : (i + 1) * segmentDuration;

    segments.push({
      segment_order: i + 1,
      text_arabic: ar,
      text_english: en,
      audio_start_ms: startMs,
      audio_end_ms: endMs,
    });
  }

  return segments;
}

async function importExcel() {
  const filePath = findExcelFile();

  if (!filePath) {
    console.error('\n❌ No Excel (.xlsx, .xls) or CSV file found.');
    return;
  }

  console.log(`\n📖 Loading spreadsheet: ${filePath}...`);
  const workbook = XLSX.readFile(filePath, { codepage: 65001 }); // UTF-8
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`✓ Loaded sheet "${sheetName}" with ${rows.length} rows.\n`);

  let importedCount = 0;

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const storyNum = idx + 1;
    const paddedNum = String(storyNum).padStart(3, '0');

    // 1. Resolve ID
    const rawId = getColumnValue(row, ['id', 'story_id', 'number', 'no', 'code', 'slug']);
    const id = rawId ? String(rawId).trim() : `hikayat-${paddedNum}`;

    // 2. Resolve Arabic Title
    const rawTitleAr = getColumnValue(row, ['title_arabic', 'arabic_title', 'title_ar', 'arabic', 'عنوان', 'العنوان']);
    const titleArabic = rawTitleAr ? String(rawTitleAr).trim() : `الحكاية ${storyNum}`;

    // 3. Resolve English Title
    const rawTitleEn = getColumnValue(row, ['title_english', 'english_title', 'title_en', 'english', 'title', 'name']);
    const titleEnglish = rawTitleEn ? String(rawTitleEn).trim() : `Hikayat ${storyNum}`;

    // 4. Resolve Category (cycles across categories if unspecified)
    const categoryOptions = ['wisdom', 'parable', 'akhlaaq', 'tarikh'];
    let category = getColumnValue(row, ['category', 'type', 'genre', 'تصنيف', 'النوع']);
    if (!category || !categoryOptions.includes(String(category).toLowerCase().trim())) {
      category = categoryOptions[idx % categoryOptions.length];
    } else {
      category = String(category).toLowerCase().trim();
    }

    // 5. Moral Theme
    const rawMoral = getColumnValue(row, ['moral_theme', 'moral', 'theme', 'lesson', 'العبرة', 'المغزى']);
    const moralTheme = rawMoral ? String(rawMoral).trim() : `Wisdom & Moral Theme (حكمة وعبرة)`;

    // 6. Audio Filename
    const rawAudio = getColumnValue(row, ['audio_filename', 'audio', 'audio_file', 'filename', 'mp3', 'file']);
    const audioFilename = rawAudio ? String(rawAudio).trim() : `hikayat_${paddedNum}.mp3`;

    // 7. Duration
    let durationMs = Number(
      getColumnValue(row, ['duration_ms', 'duration', 'duration_seconds', 'length', 'time']) || 45000
    );
    if (durationMs > 0 && durationMs < 1000) {
      durationMs = durationMs * 1000;
    }

    // 8. Texts
    const textArabic = String(
      getColumnValue(row, ['text_arabic', 'story_arabic', 'arabic_text', 'content_ar', 'النص']) || ''
    ).trim();

    const textEnglish = String(
      getColumnValue(row, ['text_english', 'story_english', 'english_text', 'content_en', 'translation']) || ''
    ).trim();

    // Upsert story into DB
    await db.execute({
      sql: `
        INSERT INTO stories (id, title_arabic, title_english, category, moral_theme, audio_filename, duration_ms, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, unixepoch())
        ON CONFLICT(id) DO UPDATE SET
          title_arabic = excluded.title_arabic,
          title_english = excluded.title_english,
          category = excluded.category,
          moral_theme = excluded.moral_theme,
          audio_filename = excluded.audio_filename,
          duration_ms = excluded.duration_ms
      `,
      args: [
        String(id),
        String(titleArabic),
        String(titleEnglish),
        category,
        String(moralTheme),
        String(audioFilename),
        durationMs,
      ],
    });

    // Handle Segments
    if (textArabic || textEnglish) {
      const segments = autoSegmentText(textArabic, textEnglish, durationMs);
      await db.execute({
        sql: `DELETE FROM story_segments WHERE story_id = ?`,
        args: [String(id)],
      });

      for (const seg of segments) {
        await db.execute({
          sql: `
            INSERT INTO story_segments (id, story_id, segment_order, text_arabic, text_english, audio_start_ms, audio_end_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            `${id}-seg-${seg.segment_order}`,
            String(id),
            seg.segment_order,
            seg.text_arabic,
            seg.text_english,
            seg.audio_start_ms,
            seg.audio_end_ms,
          ],
        });
      }
    }

    // Update FTS Index
    await db.execute({
      sql: `DELETE FROM stories_fts WHERE story_id = ?`,
      args: [String(id)],
    });
    await db.execute({
      sql: `
        INSERT INTO stories_fts (story_id, title_arabic, title_english, moral_theme)
        VALUES (?, ?, ?, ?)
      `,
      args: [String(id), String(titleArabic), String(titleEnglish), String(moralTheme)],
    });

    importedCount++;
    if (importedCount % 20 === 0 || importedCount === rows.length) {
      console.log(`✓ Processed ${importedCount} / ${rows.length} stories...`);
    }
  }

  console.log(`\n🎉 Successfully imported all ${importedCount} Hikayat stories into Turso/libSQL!`);
  console.log(`Open http://localhost:3000 to view your complete library.\n`);
}

importExcel().catch((err) => {
  console.error('Fatal error during Excel import:', err);
  process.exit(1);
});
