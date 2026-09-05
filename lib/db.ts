import { createClient, Client } from '@libsql/client';

// Lazy-initialized client to support both edge/serverless and local development
let cachedClient: Client | null = null;

export function getDb(): Client {
  if (cachedClient) return cachedClient;

  const url = process.env.TURSO_DATABASE_URL || 'file:hikayat_local.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  cachedClient = createClient({
    url,
    authToken,
  });

  return cachedClient;
}

export const db = getDb();

export interface StorySegment {
  id: string;
  story_id?: string;
  segment_order: number;
  text_arabic: string;
  text_english: string;
  audio_start_ms: number;
  audio_end_ms: number;
}

export interface VocabularyGloss {
  id: string;
  story_id?: string;
  word_arabic: string;
  transliteration: string;
  root_letters: string | null;
  definition: string;
}

export interface StoryMetadata {
  id: string;
  title_arabic: string;
  title_english: string;
  category: 'parable' | 'tarikh' | 'akhlaaq' | 'wisdom' | string;
  moral_theme: string;
  audio_filename: string;
  duration_ms: number;
  created_at?: number;
  segment_count?: number;
}

export interface HikayatStory extends StoryMetadata {
  audio_url: string;
  segments: StorySegment[];
  glosses: VocabularyGloss[];
}

export function resolveAudioUrl(filename: string): string {
  // If it's already an absolute URL or data URI, return as-is
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/')) {
    return filename;
  }
  const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_MEDIA_URL || '';
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL.replace(/\/+$/, '')}/${filename}`;
  }
  return `/audio/${filename}`;
}

export async function getStoryById(storyId: string): Promise<HikayatStory | null> {
  const client = getDb();
  
  const storyRes = await client.execute({
    sql: `SELECT * FROM stories WHERE id = ?`,
    args: [storyId],
  });

  if (storyRes.rows.length === 0) return null;
  const story = storyRes.rows[0];

  const [segmentsRes, glossesRes] = await Promise.all([
    client.execute({
      sql: `SELECT * FROM story_segments WHERE story_id = ? ORDER BY segment_order ASC`,
      args: [storyId],
    }),
    client.execute({
      sql: `SELECT * FROM vocabulary_glosses WHERE story_id = ?`,
      args: [storyId],
    }),
  ]);

  const audioUrl = resolveAudioUrl(String(story.audio_filename));

  return {
    id: String(story.id),
    title_arabic: String(story.title_arabic),
    title_english: String(story.title_english),
    category: String(story.category),
    moral_theme: String(story.moral_theme),
    audio_filename: String(story.audio_filename),
    audio_url: audioUrl,
    duration_ms: Number(story.duration_ms || 0),
    created_at: story.created_at ? Number(story.created_at) : undefined,
    segments: segmentsRes.rows.map((row) => ({
      id: String(row.id),
      segment_order: Number(row.segment_order),
      text_arabic: String(row.text_arabic),
      text_english: String(row.text_english),
      audio_start_ms: Number(row.audio_start_ms),
      audio_end_ms: Number(row.audio_end_ms),
    })),
    glosses: glossesRes.rows.map((row) => ({
      id: String(row.id),
      word_arabic: String(row.word_arabic),
      transliteration: String(row.transliteration),
      root_letters: row.root_letters ? String(row.root_letters) : null,
      definition: String(row.definition),
    })),
  };
}

export async function getAllStories(category?: string): Promise<StoryMetadata[]> {
  const client = getDb();
  
  let sql = `
    SELECT s.*, COUNT(ss.id) as segment_count
    FROM stories s
    LEFT JOIN story_segments ss ON s.id = ss.story_id
  `;
  const args: any[] = [];

  if (category && category !== 'all') {
    sql += ` WHERE s.category = ?`;
    args.push(category);
  }

  sql += ` GROUP BY s.id ORDER BY s.created_at DESC`;

  const res = await client.execute({ sql, args });

  return res.rows.map((row) => ({
    id: String(row.id),
    title_arabic: String(row.title_arabic),
    title_english: String(row.title_english),
    category: String(row.category),
    moral_theme: String(row.moral_theme),
    audio_filename: String(row.audio_filename),
    duration_ms: Number(row.duration_ms || 0),
    created_at: row.created_at ? Number(row.created_at) : undefined,
    segment_count: Number(row.segment_count || 0),
  }));
}

export async function searchStories(query: string): Promise<StoryMetadata[]> {
  const client = getDb();
  const trimmed = query.trim();
  if (!trimmed) return getAllStories();

  // Use SQLite FTS5 for full text match, with fallback to LIKE
  try {
    const ftsRes = await client.execute({
      sql: `
        SELECT s.*, COUNT(ss.id) as segment_count
        FROM stories s
        JOIN stories_fts fts ON s.id = fts.story_id
        LEFT JOIN story_segments ss ON s.id = ss.story_id
        WHERE stories_fts MATCH ?
        GROUP BY s.id
      `,
      args: [`${trimmed}*`],
    });

    if (ftsRes.rows.length > 0) {
      return ftsRes.rows.map((row) => ({
        id: String(row.id),
        title_arabic: String(row.title_arabic),
        title_english: String(row.title_english),
        category: String(row.category),
        moral_theme: String(row.moral_theme),
        audio_filename: String(row.audio_filename),
        duration_ms: Number(row.duration_ms || 0),
        created_at: row.created_at ? Number(row.created_at) : undefined,
        segment_count: Number(row.segment_count || 0),
      }));
    }
  } catch (err) {
    // Fallback to LIKE search if FTS syntax is tricky or table is empty
    console.warn('FTS5 query fallback:', err);
  }

  const likeArg = `%${trimmed}%`;
  const fallbackRes = await client.execute({
    sql: `
      SELECT s.*, COUNT(ss.id) as segment_count
      FROM stories s
      LEFT JOIN story_segments ss ON s.id = ss.story_id
      WHERE s.title_arabic LIKE ? OR s.title_english LIKE ? OR s.moral_theme LIKE ? OR s.category LIKE ?
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `,
    args: [likeArg, likeArg, likeArg, likeArg],
  });

  return fallbackRes.rows.map((row) => ({
    id: String(row.id),
    title_arabic: String(row.title_arabic),
    title_english: String(row.title_english),
    category: String(row.category),
    moral_theme: String(row.moral_theme),
    audio_filename: String(row.audio_filename),
    duration_ms: Number(row.duration_ms || 0),
    created_at: row.created_at ? Number(row.created_at) : undefined,
    segment_count: Number(row.segment_count || 0),
  }));
}
