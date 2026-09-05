'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { HikayatStory, VocabularyGloss } from '@/lib/db';
import VocabularyModal from './VocabularyModal';

type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export default function HikayatReader({ story }: { story: HikayatStory }) {
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [selectedGloss, setSelectedGloss] = useState<VocabularyGloss | null>(null);
  const [copied, setCopied] = useState(false);

  // Normalize Arabic text to match glosses without diacritics
  const stripDiacritics = (text: string) => {
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
  };

  // Map words to glosses
  const glossMap = useMemo(() => {
    const map = new Map<string, VocabularyGloss>();
    if (!story.glosses) return map;
    for (const g of story.glosses) {
      map.set(g.word_arabic, g);
      map.set(stripDiacritics(g.word_arabic), g);
    }
    return map;
  }, [story.glosses]);

  // Render Arabic text with interactive gloss triggers
  const renderArabicText = (text: string) => {
    const words = text.split(' ');
    return words.map((word, wIdx) => {
      const cleanWord = stripDiacritics(word.replace(/[،.؛:؟!«»"']/g, ''));
      const glossMatch = glossMap.get(word) || glossMap.get(cleanWord);

      if (glossMatch) {
        return (
          <span
            key={wIdx}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGloss(glossMatch);
            }}
            className="inline-block cursor-help border-b-2 border-dotted border-[#B45309]/60 hover:border-[#B45309] text-[#78350F] hover:bg-[#FEF3C7] px-0.5 rounded transition"
            title={`${glossMatch.transliteration} [${glossMatch.root_letters || ''}]`}
          >
            {word}{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  // Font size classes with generous calligraphy line-height
  const arabicFontClasses = {
    sm: 'text-2xl leading-[2.4]',
    md: 'text-3xl sm:text-4xl leading-[2.6]',
    lg: 'text-4xl sm:text-5xl leading-[2.8]',
    xl: 'text-5xl sm:text-6xl leading-[3.0]',
  }[fontSize];

  const englishFontClasses = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
    xl: 'text-lg sm:text-xl leading-relaxed',
  }[fontSize];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBF9F5] text-[#1A1918]">
      {/* Reader Minimal Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E7E2D8] px-4 sm:px-6 h-14">
        <div className="max-w-3xl mx-auto h-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#636059] hover:text-[#1A1918] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Hikayat</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Font Size Toggle */}
            <button
              onClick={() => {
                const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
                const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
                setFontSize(next);
              }}
              className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg text-xs font-mono text-[#636059] hover:text-[#1A1918] transition shadow-xs flex items-center gap-1"
              title="Adjust Font Size"
            >
              <span>Font</span>
              <span className="font-bold text-[#92400E]">
                {fontSize === 'xl' ? 'XL' : fontSize === 'lg' ? 'L' : fontSize === 'sm' ? 'S' : 'M'}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-1.5 bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg text-[#636059] hover:text-[#1A1918] transition shadow-xs"
              title="Copy Story Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Open-Book Story Manuscript Canvas */}
      <main className="max-w-3xl mx-auto w-full px-5 sm:px-8 py-10 sm:py-16 flex-1">
        <article className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-10">
          {/* Story Header */}
          <header className="text-center space-y-4 border-b border-[#EAE4D9] pb-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#8C8578]">
              <span className="uppercase tracking-widest font-semibold text-[#92400E]">
                {story.category}
              </span>
              {story.moral_theme && story.moral_theme !== 'Wisdom & Moral Theme (حكمة وعبرة)' && (
                <>
                  <span>·</span>
                  <span>{story.moral_theme}</span>
                </>
              )}
            </div>

            <h1
              dir="rtl"
              className="text-3xl sm:text-5xl font-bold font-arabic text-[#1A1918] leading-[2.0] tracking-normal"
            >
              {story.title_arabic}
            </h1>

            {story.title_english &&
              story.title_english !== story.title_arabic &&
              !story.title_english.startsWith('Hikayat ') && (
                <p className="text-xs sm:text-sm text-[#7A7468] font-mono">
                  {story.title_english}
                </p>
              )}
          </header>

          {/* Continuous Open-Book Story Narrative */}
          <div className="space-y-8 text-[#1A1918]">
            {story.segments && story.segments.length > 0 ? (
              story.segments.map((seg, idx) => (
                <div key={seg.id || idx} className="space-y-3">
                  {/* Arabic Paragraph Flow */}
                  {seg.text_arabic && (
                    <p
                      dir="rtl"
                      className={`font-arabic ${arabicFontClasses} text-right text-[#1A1918] selection:bg-[#FEF3C7]`}
                    >
                      {renderArabicText(seg.text_arabic)}
                    </p>
                  )}

                  {/* Parallel English Translation if custom translation exists */}
                  {seg.text_english && !seg.text_english.startsWith('Segment ') && (
                    <p
                      className={`${englishFontClasses} font-sans text-[#636059] border-t border-[#F2ECE1] pt-2`}
                    >
                      {seg.text_english}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#636059] font-arabic text-2xl" dir="rtl">
                {story.title_arabic}
              </div>
            )}
          </div>

          {/* Classical End Ornament */}
          <div className="text-center pt-8 border-t border-[#EAE4D9] text-[#C5BEB2] text-xl font-arabic">
            ❦
          </div>
        </article>
      </main>

      {/* Lexicon Modal */}
      <VocabularyModal gloss={selectedGloss} onClose={() => setSelectedGloss(null)} />
    </div>
  );
}
