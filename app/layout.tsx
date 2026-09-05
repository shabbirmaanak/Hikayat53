import type { Metadata } from 'next';
import { Amiri, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'حكاية | Hikayat — Bilingual Audio-Synced Storytelling Platform',
  description:
    'A bilingual, audio-synchronized Arabic-English storytelling platform running on Turso Database (libSQL) and Cloudflare R2.',
  keywords: ['Arabic storytelling', 'Hikayat', 'Bilingual audio sync', 'Turso libSQL', 'Cloudflare R2', 'Arabic lexicon'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${amiri.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1A1918]">
        {children}
      </body>
    </html>
  );
}
