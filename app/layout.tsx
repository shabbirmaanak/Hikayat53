import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Amiri, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Load Kanz al Lulu local font
const kanzAlLulu = localFont({
  src: '../public/fonts/KanzalLulu-Regular.ttf',
  variable: '--font-kanz',
  display: 'swap',
  fallback: ['Amiri', 'Noto Naskh Arabic', 'serif'],
});

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
  title: 'حكاية | Hikayat — Bilingual Storytelling Platform',
  description:
    'A bilingual, Arabic-English storytelling platform running on Turso Database (libSQL) with custom Kanz al Lulu calligraphy typography.',
  keywords: ['Arabic storytelling', 'Hikayat', 'Kanz al Lulu font', 'Turso libSQL', 'Arabic lexicon'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      className={`${kanzAlLulu.variable} ${amiri.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1A1918]">
        {children}
      </body>
    </html>
  );
}
