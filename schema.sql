-- ===================================================
-- حكاية (Hikayat) Database Schema (Turso / libSQL / SQLite)
-- ===================================================

-- 1. Core Story Metadata
CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    title_arabic TEXT NOT NULL,
    title_english TEXT NOT NULL,
    category TEXT CHECK(category IN ('parable', 'tarikh', 'akhlaaq', 'wisdom')) NOT NULL,
    moral_theme TEXT NOT NULL,
    audio_filename TEXT NOT NULL,
    duration_ms INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
);

-- 2. Timed Sentence Segments for Audio Sync
CREATE TABLE IF NOT EXISTS story_segments (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    segment_order INTEGER NOT NULL,
    text_arabic TEXT NOT NULL,
    text_english TEXT NOT NULL,
    audio_start_ms INTEGER NOT NULL,
    audio_end_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_segments_story_order ON story_segments(story_id, segment_order ASC);

-- 3. Tap-to-Reveal Lexicon & Cultural Roots
CREATE TABLE IF NOT EXISTS vocabulary_glosses (
    id TEXT PRIMARY KEY,
    story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    word_arabic TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    root_letters TEXT,
    definition TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_story ON vocabulary_glosses(story_id);

-- 4. Full-Text Search (FTS5) for search
CREATE VIRTUAL TABLE IF NOT EXISTS stories_fts USING fts5(
    story_id UNINDEXED,
    title_arabic,
    title_english,
    moral_theme
);
