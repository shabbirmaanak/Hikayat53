import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'file:hikayat_local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

console.log(`Connecting to Turso/libSQL database at: ${url}`);
const db = createClient({ url, authToken });

interface SeedStory {
  id: string;
  title_arabic: string;
  title_english: string;
  category: 'parable' | 'tarikh' | 'akhlaaq' | 'wisdom';
  moral_theme: string;
  audio_filename: string;
  duration_ms: number;
  segments: Array<{
    segment_order: number;
    text_arabic: string;
    text_english: string;
    audio_start_ms: number;
    audio_end_ms: number;
  }>;
  glosses: Array<{
    word_arabic: string;
    transliteration: string;
    root_letters: string;
    definition: string;
  }>;
}

const sampleStories: SeedStory[] = [
  {
    id: 'hikayat-luqman-01',
    title_arabic: 'وصايا لقمان الحكيم لابنه',
    title_english: 'The Wisdom of Luqman to His Son',
    category: 'wisdom',
    moral_theme: 'Humility, Gratitude, and Conscious Speech (التواضع والشكر وحفظ اللسان)',
    audio_filename: 'hikayat_01_luqman.mp3',
    duration_ms: 45000,
    segments: [
      {
        segment_order: 1,
        text_arabic: 'يا بُنَيَّ، إِنَّ الحِكْمَةَ أَوَّلُهَا مَخَافَةُ اللهِ، وَرَأْسُهَا حُسْنُ الخُلُقِ مَعَ النَّاسِ.',
        text_english: 'O my dear son! Indeed, the foundation of wisdom is the reverence of God, and its pinnacle is noble conduct with people.',
        audio_start_ms: 0,
        audio_end_ms: 8500,
      },
      {
        segment_order: 2,
        text_arabic: 'وَاخْفِضْ مِنْ صَوْتِكَ، وَلَا تَمْشِ فِي الأَرْضِ مَرَحًا، إِنَّ اللهَ لَا يُحِبُّ كُلَّ مُخْتَالٍ فَخُورٍ.',
        text_english: 'And lower your voice, and walk not upon the earth insolently; for God loves not any arrogant boaster.',
        audio_start_ms: 8500,
        audio_end_ms: 17200,
      },
      {
        segment_order: 3,
        text_arabic: 'يَا بُنَيَّ، إِذَا كُنْتَ فِي صَلَاةٍ فَاحْفَظْ قَلْبَكَ، وَإِذَا كُنْتَ عَلَى طَعَامٍ فَاحْفَظْ حَلْقَكَ.',
        text_english: 'O my son, when you stand in prayer guard your heart, and when you partake in food guard your throat.',
        audio_start_ms: 17200,
        audio_end_ms: 26000,
      },
      {
        segment_order: 4,
        text_arabic: 'وَإِذَا كُنْتَ فِي دَارِ غَيْرِكَ فَاحْفَظْ عَيْنَكَ، وَإِذَا كُنْتَ بَيْنَ النَّاسِ فَاحْفَظْ لِسَانَكَ.',
        text_english: 'When you are in the house of another guard your gaze, and when you are among company guard your tongue.',
        audio_start_ms: 26000,
        audio_end_ms: 35500,
      },
      {
        segment_order: 5,
        text_arabic: 'وَاعْلَمْ أَنَّ الصَّبْرَ عَلَى الشَّدَائِدِ عِزٌّ، وَالشُّكْرَ فِي الرَّخَاءِ زِيَادَةٌ وَنَمَاءٌ.',
        text_english: 'And know that patience through adversity is nobility, and gratitude in times of ease brings abundance and growth.',
        audio_start_ms: 35500,
        audio_end_ms: 45000,
      },
    ],
    glosses: [
      {
        word_arabic: 'الحِكْمَةَ',
        transliteration: 'al-Hikmah',
        root_letters: 'ح-ك-م',
        definition: 'Wisdom, sound judgment, understanding the reality of matters and acting accordingly.',
      },
      {
        word_arabic: 'مَخَافَةُ',
        transliteration: 'Makhafah',
        root_letters: 'خ-و-ف',
        definition: 'Reverential awe, deep respect and conscious awareness that prevents wrongdoing.',
      },
      {
        word_arabic: 'مُخْتَالٍ',
        transliteration: 'Mukhtal',
        root_letters: 'خ-ي-ل',
        definition: 'An arrogant person who walks proudly with self-admiration and vanity.',
      },
      {
        word_arabic: 'الصَّبْرَ',
        transliteration: 'as-Sabr',
        root_letters: 'ص-ب-ر',
        definition: 'Steadfast perseverance, emotional restraint, and endurance through trials.',
      },
      {
        word_arabic: 'الرَّخَاءِ',
        transliteration: 'ar-Rakhaa',
        root_letters: 'ر-خ-و',
        definition: 'Affluence, ease of living, tranquility, and peace.',
      },
    ],
  },
  {
    id: 'hikayat-traveler-date-palm-02',
    title_arabic: 'المسافر وشجرة النخيل',
    title_english: 'The Traveler and the Date Palm',
    category: 'parable',
    moral_theme: 'Generosity without Expectation & Resilience in Dry Lands (العطاء بلا مقابل)',
    audio_filename: 'hikayat_02_palm.mp3',
    duration_ms: 38000,
    segments: [
      {
        segment_order: 1,
        text_arabic: 'سَارَ رَجُلٌ فِي صَحْرَاءَ قَاحِلَةٍ تَحْتَ شَمْسٍ حَارِقَةٍ، حَتَّى كَادَ يَهْلِكُ مِنَ الظَّمَإِ وَالعَطَشِ.',
        text_english: 'A man walked through a barren desert under a scorching sun, until he was near perishing from severe thirst.',
        audio_start_ms: 0,
        audio_end_ms: 9000,
      },
      {
        segment_order: 2,
        text_arabic: 'فَلَمَّا بَلَغَ طَرَفَ الوَاحَةِ، رَأَى نَخْلَةً بَاسِقَةً تُظِلُّ الأَرْضَ بِجَنَاهَا وَرُطَبِهَا الجَنِيِّ.',
        text_english: 'When he reached the edge of an oasis, he saw a towering date palm shading the earth with its fresh, ripe dates.',
        audio_start_ms: 9000,
        audio_end_ms: 18500,
      },
      {
        segment_order: 3,
        text_arabic: 'أَكَلَ مِنْ ثِمَارِهَا وَشَرِبَ مِنْ ظِلِّهَا، ثُمَّ قَالَ: مَا أَعْظَمَ جُودَكِ يَا شَجَرَةَ الخَيْرِ!',
        text_english: 'He ate of its fruit and rested in its shade, then said: "How immense is your generosity, O tree of bounty!"',
        audio_start_ms: 18500,
        audio_end_ms: 27800,
      },
      {
        segment_order: 4,
        text_arabic: 'قَالَتِ النَّخْلَةُ: إِنَّ الرِّيحَ تَرْمِينِي بِالحَجَرِ، وَأَنَا أَرْمِيهَا بِالرُّطَبِ؛ هَكَذَا يَكُونُ كَرِيمُ الأَصْلِ.',
        text_english: 'The palm replied: "The harsh wind throws stones at me, yet I respond with sweet dates; thus is the nature of the truly noble."',
        audio_start_ms: 27800,
        audio_end_ms: 38000,
      },
    ],
    glosses: [
      {
        word_arabic: 'قَاحِلَةٍ',
        transliteration: 'Qahilah',
        root_letters: 'ق-ح-ل',
        definition: 'Arid, dry, barren land lacking vegetation or rainfall.',
      },
      {
        word_arabic: 'بَاسِقَةً',
        transliteration: 'Basiqah',
        root_letters: 'ب-س-ق',
        definition: 'Tall, lofty, towering high in full vigor and grandeur.',
      },
      {
        word_arabic: 'جُودَكِ',
        transliteration: 'Jooduki',
        root_letters: 'ج-و-د',
        definition: 'Bounty, open-handed generosity, and giving without expecting return.',
      },
      {
        word_arabic: 'الرُّطَبِ',
        transliteration: 'ar-Rutab',
        root_letters: 'ر-ط-ب',
        definition: 'Fresh ripe dates in their softest, sweetest early stage.',
      },
    ],
  },
  {
    id: 'hikayat-honey-ant-03',
    title_arabic: 'النملة وقطرة العسل',
    title_english: 'The Ant and the Drop of Honey',
    category: 'akhlaaq',
    moral_theme: 'Moderation over Greed & Knowing When to Stop (القناعة والاعتدال)',
    audio_filename: 'hikayat_03_honey_ant.mp3',
    duration_ms: 32000,
    segments: [
      {
        segment_order: 1,
        text_arabic: 'سَقَطَتْ قَطْرَةُ عَسَلٍ عَلَى الأَرْضِ، فَأَقْبَلَتْ نَمْلَةٌ صَغِيرَةٌ وَذَاقَتْ مِنْهَا ذَوْقًا يَسِيرًا.',
        text_english: 'A drop of honey fell upon the ground, and a small ant approached and tasted a modest sip of it.',
        audio_start_ms: 0,
        audio_end_ms: 8000,
      },
      {
        segment_order: 2,
        text_arabic: 'أَرَادَتِ الذَّهَابَ، لَكِنَّ لَذَّةَ العَسَلِ اسْتَهْوَتْهَا فَعَادَتْ لِتَغْتَرِفَ مَزِيدًا مِنْهَا.',
        text_english: 'She prepared to leave, but the sweetness enticed her, so she returned to scoop up more.',
        audio_start_ms: 8000,
        audio_end_ms: 15500,
      },
      {
        segment_order: 3,
        text_arabic: 'ثُمَّ لَمْ تَقْنَعْ بِالوُقُوفِ عَلَى الحَافَّةِ، فَرَمَتْ بِنَفْسِهَا فِي قَلْبِ القَطْرَةِ لِتَسْتَمْتِعَ بِكُلِّ شَيْءٍ.',
        text_english: 'Then, not content with standing at the edge, she plunged herself into the center of the drop to consume it all.',
        audio_start_ms: 15500,
        audio_end_ms: 23500,
      },
      {
        segment_order: 4,
        text_arabic: 'فَعَلِقَتْ أَرْجُلُهَا وَعَجَزَتْ عَنِ الطَّيَرَانِ؛ فَكَانَتِ القَنَاعَةُ نَجَاةً، وَكَانَ الطَّمَعُ هَلَاكًا.',
        text_english: 'Her limbs became trapped and she could not break free; contentment was safety, whereas unchecked greed was ruin.',
        audio_start_ms: 23500,
        audio_end_ms: 32000,
      },
    ],
    glosses: [
      {
        word_arabic: 'اسْتَهْوَتْهَا',
        transliteration: 'Istahwatha',
        root_letters: 'ه-و-ي',
        definition: 'Charmed her, captivated her desire, and swayed her better judgment.',
      },
      {
        word_arabic: 'القَنَاعَةُ',
        transliteration: 'al-Qana‘ah',
        root_letters: 'ق-ن-ع',
        definition: 'Contentment, satisfaction with sufficient sustenance without greed.',
      },
      {
        word_arabic: 'الطَّمَعُ',
        transliteration: 'at-Tama‘',
        root_letters: 'ط-م-ع',
        definition: 'Covetousness, insatiable desire to acquire more beyond necessity.',
      },
    ],
  },
  {
    id: 'hikayat-cave-dove-04',
    title_arabic: 'حمامة الغار وعنكبوت الهجرة',
    title_english: 'The Cave, the Dove, and the Spider',
    category: 'tarikh',
    moral_theme: 'Divine Protection through the Fragile (الحماية الإلهية بأوهن الأسباب)',
    audio_filename: 'hikayat_04_cave.mp3',
    duration_ms: 40000,
    segments: [
      {
        segment_order: 1,
        text_arabic: 'عِنْدَمَا خَرَجَ النَّبِيُّ ﷺ وَصَاحِبُهُ الصِّدِّيقُ مُهَاجِرَيْنِ، لَجَآ إِلَى غَارِ ثَوْرٍ فِي جَوْفِ اللَّيْلِ.',
        text_english: 'When the Prophet ﷺ and his loyal companion As-Siddiq set out in migration, they sought refuge in the Cave of Thawr in the depths of night.',
        audio_start_ms: 0,
        audio_end_ms: 10000,
      },
      {
        segment_order: 2,
        text_arabic: 'فَنَسَجَتِ العَنْكَبُوتُ خُيُوطَهَا عَلَى فَمِ الغَارِ، وَبَاضَتْ حَمَامَتَانِ فِي عُشٍّ بَيْنَ الصُّخُورِ.',
        text_english: 'A spider spun its delicate web across the mouth of the cave, and two doves laid eggs in a nest nestled among the rocks.',
        audio_start_ms: 10000,
        audio_end_ms: 20000,
      },
      {
        segment_order: 3,
        text_arabic: 'وَقَفَ المُطَارِدُونَ عَلَى شَفِيرِ الغَارِ، فَقَالَ أَبُو بَكْرٍ: لَوْ نَظَرَ أَحَدُهُمْ تَحْتَ قَدَمَيْهِ لَرَآنَا!',
        text_english: 'The pursuers stood at the very brink of the cave, and Abu Bakr whispered: "If one of them were only to look down at his feet, he would see us!"',
        audio_start_ms: 20000,
        audio_end_ms: 30000,
      },
      {
        segment_order: 4,
        text_arabic: 'فَأَجَابَهُ بِثِقَةٍ وَسَكِينَةٍ: «مَا ظَنُّكَ يَا أَبَا بَكْرٍ بِاثْنَيْنِ اللهُ ثَالِثُهُمَا؟» فَنَجَوَا بِفَضْلِ اللهِ.',
        text_english: 'He replied with serene certainty: "What do you think, O Abu Bakr, of two whose third is God?" And so they were protected by divine grace.',
        audio_start_ms: 30000,
        audio_end_ms: 40000,
      },
    ],
    glosses: [
      {
        word_arabic: 'مُهَاجِرَيْنِ',
        transliteration: 'Muhajirayn',
        root_letters: 'ه-ج-ر',
        definition: 'Two emigrants leaving their homeland for the sake of faith and principles.',
      },
      {
        word_arabic: 'شَفِيرِ',
        transliteration: 'Shafeer',
        root_letters: 'ش-ف-ر',
        definition: 'The outer edge, brim, or precipice of an entrance or cliff.',
      },
      {
        word_arabic: 'سَكِينَةٍ',
        transliteration: 'Sakeenah',
        root_letters: 'س-ك-ن',
        definition: 'Tranquility, divine peace of heart, and spiritual composure during turmoil.',
      },
    ],
  },
];

async function seed() {
  console.log('--- Initializing Hikayat Database Tables ---');

  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title_arabic TEXT NOT NULL,
      title_english TEXT NOT NULL,
      category TEXT CHECK(category IN ('parable', 'tarikh', 'akhlaaq', 'wisdom')) NOT NULL,
      moral_theme TEXT NOT NULL,
      audio_filename TEXT NOT NULL,
      duration_ms INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );`,

    `CREATE TABLE IF NOT EXISTS story_segments (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      segment_order INTEGER NOT NULL,
      text_arabic TEXT NOT NULL,
      text_english TEXT NOT NULL,
      audio_start_ms INTEGER NOT NULL,
      audio_end_ms INTEGER NOT NULL
    );`,

    `CREATE INDEX IF NOT EXISTS idx_segments_story_order ON story_segments(story_id, segment_order ASC);`,

    `CREATE TABLE IF NOT EXISTS vocabulary_glosses (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
      word_arabic TEXT NOT NULL,
      transliteration TEXT NOT NULL,
      root_letters TEXT,
      definition TEXT NOT NULL
    );`,

    `CREATE INDEX IF NOT EXISTS idx_vocabulary_story ON vocabulary_glosses(story_id);`,

    `CREATE VIRTUAL TABLE IF NOT EXISTS stories_fts USING fts5(
      story_id UNINDEXED,
      title_arabic,
      title_english,
      moral_theme
    );`
  ];

  for (const stmt of ddlStatements) {
    try {
      await db.execute(stmt);
    } catch (err: any) {
      if (!err.message?.includes('already exists')) {
        console.warn(`Warning executing statement:`, err.message);
      }
    }
  }

  console.log('Schema tables verified.');

  console.log('--- Seeding Stories, Segments, and Lexicon Roots ---');
  for (const story of sampleStories) {
    // Upsert story
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
        story.id,
        story.title_arabic,
        story.title_english,
        story.category,
        story.moral_theme,
        story.audio_filename,
        story.duration_ms,
      ],
    });

    // Delete existing segments & glosses for idempotency
    await db.execute({
      sql: `DELETE FROM story_segments WHERE story_id = ?`,
      args: [story.id],
    });
    await db.execute({
      sql: `DELETE FROM vocabulary_glosses WHERE story_id = ?`,
      args: [story.id],
    });
    await db.execute({
      sql: `DELETE FROM stories_fts WHERE story_id = ?`,
      args: [story.id],
    });

    // Insert Segments
    for (const seg of story.segments) {
      const segId = `${story.id}-seg-${seg.segment_order}`;
      await db.execute({
        sql: `
          INSERT INTO story_segments (id, story_id, segment_order, text_arabic, text_english, audio_start_ms, audio_end_ms)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          segId,
          story.id,
          seg.segment_order,
          seg.text_arabic,
          seg.text_english,
          seg.audio_start_ms,
          seg.audio_end_ms,
        ],
      });
    }

    // Insert Glosses
    for (let i = 0; i < story.glosses.length; i++) {
      const gloss = story.glosses[i];
      const glossId = `${story.id}-gloss-${i + 1}`;
      await db.execute({
        sql: `
          INSERT INTO vocabulary_glosses (id, story_id, word_arabic, transliteration, root_letters, definition)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          glossId,
          story.id,
          gloss.word_arabic,
          gloss.transliteration,
          gloss.root_letters,
          gloss.definition,
        ],
      });
    }

    // Insert FTS entry
    await db.execute({
      sql: `
        INSERT INTO stories_fts (story_id, title_arabic, title_english, moral_theme)
        VALUES (?, ?, ?, ?)
      `,
      args: [
        story.id,
        story.title_arabic,
        story.title_english,
        story.moral_theme,
      ],
    });

    console.log(`✓ Seeded story: "${story.title_english}" (${story.title_arabic}) with ${story.segments.length} segments & ${story.glosses.length} glosses.`);
  }

  console.log('\n--- Hikayat Database Seeding Complete! ---');
}

seed().catch((err) => {
  console.error('Fatal error during database seeding:', err);
  process.exit(1);
});
