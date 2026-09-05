# حكاية (Hikayat) — Bilingual Audio-Synced Storytelling Platform

> **حكاية** is a modern bilingual (Arabic-English) storytelling web platform featuring precise millisecond audio-segment synchronization, karaoke scansion highlighting, and tap-to-reveal classical root morphology. Built entirely to run on **Turso's free tier** (libSQL database with FTS5 search) and **Cloudflare R2** (zero-egress audio CDN).

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER (PWA / Web)                        │
│  - Next.js 15 App Router / Tailwind CSS (Arabic RTL + English Dual Typography) │
│  - Web Audio Sync Engine (Real-time segment scansion & karaoke highlights)  │
│  - Tap-to-Reveal Lexicon Drawer (Triconsonantal root letters & definitions) │
│  - Story Explorer with Category Filters & FTS5 Search                       │
└───────────────────────┬─────────────────────────────┬───────────────────────┘
                        │ Reads Media (.mp3)          │ Queries Metadata/Text
                        ▼                             ▼
┌──────────────────────────────────┐        ┌─────────────────────────────────┐
│     Cloudflare R2 (Audio CDN)    │        │      Next.js Serverless API     │
│  - Voiced narration (.mp3)       │        │  - Route handlers:              │
│  - Zero egress / bandwidth fees  │        │    /api/stories                 │
│  - 10 GB Free Storage Tier       │        │    /api/stories/[id]            │
└──────────────────────────────────┘        │  - libSQL Client edge SDK       │
                                            └────────────────┬────────────────┘
                                                             │
                                                             ▼
                                            ┌─────────────────────────────────┐
                                            │      Turso Database (libSQL)    │
                                            │  - stories & story_segments     │
                                            │  - FTS5 Full-text search engine │
                                            │  - vocabulary_glosses           │
                                            │  - 5 GB Free / 500M monthly r/w │
                                            └─────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

The application includes a zero-config local SQLite/libSQL setup so you can run it immediately without external cloud accounts.

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize and Seed the Database
```bash
npm run db:seed
```
*This creates the database tables, FTS5 search index, and seeds 4 classical bilingual stories with audio segments and vocabulary glosses into `hikayat_local.db`.*

### 3. Start the Next.js Dev Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ☁️ Production Deployment: Turso & Cloudflare R2

### Step 1: Turso Database Setup

1. Install the Turso CLI and create a database:
   ```bash
   turso auth signup
   turso db create hikayat-db
   ```

2. Retrieve your database URL and create an auth token:
   ```bash
   turso db show hikayat-db --url
   # Output: libsql://hikayat-db-[your-user].turso.io

   turso db tokens create hikayat-db
   # Output: [JWT_TOKEN]
   ```

3. Update `.env.local`:
   ```ini
   TURSO_DATABASE_URL="libsql://hikayat-db-[your-user].turso.io"
   TURSO_AUTH_TOKEN="your-turso-jwt-token"
   ```

4. Push schema and seed sample data to Turso:
   ```bash
   npm run db:seed
   ```

---

### Step 2: Cloudflare R2 Audio Storage Setup

Cloudflare R2 provides S3-compatible object storage with **zero egress fees**.

1. In the **Cloudflare Dashboard**, navigate to **R2** > **Create Bucket** (e.g., `hikayat-audio`).
2. Under **Settings** > **Public Access**, enable a **Custom Domain** or **R2.dev subdomain**.
3. Create R2 API Tokens with **Admin Read & Write** permissions under **Manage R2 API Tokens**.
4. Configure `.env.local`:
   ```ini
   NEXT_PUBLIC_R2_MEDIA_URL="https://pub-yourbucketid.r2.dev/audio"
   R2_ACCOUNT_ID="your_cloudflare_account_id"
   R2_ACCESS_KEY_ID="your_r2_access_key_id"
   R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
   R2_BUCKET_NAME="hikayat-audio"
   ```

5. Upload audio narration files to R2:
   ```bash
   # Uploads all .mp3 files from public/audio to your R2 bucket:
   npm run r2:upload
   ```

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   └── stories/
│   │       ├── route.ts            # GET /api/stories (List, category filter, FTS query)
│   │       └── [id]/
│   │           └── route.ts        # GET /api/stories/:id (Single story + segments + glosses)
│   ├── globals.css                 # Dark theme variables, Arabic font optimizations
│   ├── layout.tsx                  # Root layout with Amiri, Inter & JetBrains Mono
│   ├── page.tsx                    # Home catalog & architecture dashboard
│   └── story/
│       └── [id]/
│           └── page.tsx            # Story reader page
├── components/
│   ├── HikayatReader.tsx           # Audio sync engine & interactive bilingual player
│   ├── Navbar.tsx                  # Top brand navigation bar
│   ├── Footer.tsx                  # Footer component
│   ├── StoryCard.tsx               # Preview card for stories
│   ├── StoryGrid.tsx               # Category filtering and search grid
│   └── VocabularyModal.tsx         # Lexicon root & morphology inspection modal
├── lib/
│   └── db.ts                       # Turso / libSQL client & query helpers
├── scripts/
│   ├── seed.ts                     # Database DDL & sample data seeder
│   └── upload-r2.ts                # S3-compatible Cloudflare R2 uploader script
├── public/
│   └── audio/                      # Local audio drop folder
├── schema.sql                      # DDL schema for Turso / SQLite
├── .env.example                    # Environment variables template
└── package.json
```

---

## 📖 Adding New Stories

You can add new stories using the `scripts/seed.ts` format or via SQL in the Turso CLI:

```sql
-- 1. Insert Story
INSERT INTO stories (id, title_arabic, title_english, category, moral_theme, audio_filename, duration_ms)
VALUES ('hikayat-05', 'عنوان الحكاية', 'Story Title', 'wisdom', 'Patience & Diligence', 'hikayat_05.mp3', 60000);

-- 2. Insert Timed Segments
INSERT INTO story_segments (id, story_id, segment_order, text_arabic, text_english, audio_start_ms, audio_end_ms)
VALUES ('hikayat-05-seg-1', 'hikayat-05', 1, 'النص العربي للجملة الأولى', 'English translation of first segment', 0, 8500);

-- 3. Insert Lexicon Glosses
INSERT INTO vocabulary_glosses (id, story_id, word_arabic, transliteration, root_letters, definition)
VALUES ('hikayat-05-gloss-1', 'hikayat-05', 'الحكمة', 'al-Hikmah', 'ح-ك-م', 'Wisdom and sound judgment.');
```

---

## 🛠️ Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on port 3000 |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts production server |
| `npm run db:seed` | Initializes schema and seeds sample stories into Turso/SQLite |
| `npm run r2:upload` | Uploads local audio files to Cloudflare R2 bucket |
