'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Check, BookOpen } from 'lucide-react';
import { HikayatStory, StorySegment, VocabularyGloss } from '@/lib/db';
import VocabularyModal from './VocabularyModal';

type ViewMode = 'dual' | 'arabic' | 'english';
type FontSize = 'sm' | 'md' | 'lg';

export default function HikayatReader({ story }: { story: HikayatStory }) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dual');
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

  // Font size classes
  const arabicFontClasses = {
    sm: 'text-xl sm:text-2xl leading-loose',
    md: 'text-2xl sm:text-3xl leading-loose',
    lg: 'text-3xl sm:text-4xl leading-loose',
  }[fontSize];

  const englishFontClasses = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed',
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
            {/* View Mode Switcher */}
            <div className="flex bg-[#EAE4D9]/70 p-0.5 rounded-lg border border-[#E0D8CB] text-xs font-mono">
              <button
                onClick={() => setViewMode('dual')}
                className={`px-2 py-1 rounded transition ${
                  viewMode === 'dual'
                    ? 'bg-[#FFFFFF] text-[#78350F] font-semibold shadow-xs'
                    : 'text-[#636059] hover:text-[#1A1918]'
                }`}
              >
                Dual
              </button>
              <button
                onClick={() => setViewMode('arabic')}
                className={`px-2 py-1 rounded transition ${
                  viewMode === 'arabic'
                    ? 'bg-[#FFFFFF] text-[#78350F] font-semibold shadow-xs'
                    : 'text-[#636059] hover:text-[#1A1918]'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setViewMode('english')}
                className={`px-2 py-1 rounded transition ${
                  viewMode === 'english'
                    ? 'bg-[#FFFFFF] text-[#78350F] font-semibold shadow-xs'
                    : 'text-[#636059] hover:text-[#1A1918]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Font Size Toggle */}
            <button
              onClick={() => {
                const sizes: FontSize[] = ['sm', 'md', 'lg'];
                const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
                setFontSize(next);
              }}
              className="px-2 py-1 bg-[#FFFFFF] border border-[#E7E2D8] rounded-lg text-xs font-mono text-[#636059] hover:text-[#1A1918] transition shadow-xs"
              title="Adjust Font Size"
            >
              A{fontSize === 'lg' ? '+' : fontSize === 'sm' ? '-' : ''}
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

      {/* Reader Main Body */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        {/* Story Header */}
        <header className="mb-12 text-center space-y-3 border-b border-[#E7E2D8] pb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#8C8578]">
            <span className="uppercase tracking-wider font-semibold text-[#92400E]">
              {story.category}
            </span>
            {story.moral_theme && (
              <>
                <span>·</span>
                <span>{story.moral_theme}</span>
              </>
            )}
          </div>

          <h1
            dir="rtl"
            className="text-3xl sm:text-5xl font-bold font-arabic text-[#1A1918] leading-tight pt-1"
          >
            {story.title_arabic}
          </h1>

          {story.title_english && (
            <p className="text-sm sm:text-base text-[#524D44] font-sans">
              {story.title_english}
            </p>
          )}
        </header>

        {/* Story Paragraphs / Segments */}
        <div className="space-y-6 pb-20">
          {story.segments && story.segments.length > 0 ? (
            story.segments.map((seg, idx) => {
              const isActive = activeSegmentIndex === idx;
              return (
                <div
                  key={seg.id}
                  onClick={() => setActiveSegmentIndex(isActive ? null : idx)}
                  className={`group relative rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFFFFF] border border-[#DCD5C8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#1A1918]'
                      : 'hover:bg-[#F2ECE1]/40 text-[#524D44]'
                  }`}
                >
                  {/* Segment Focus Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#B45309] rounded-r" />
                  )}

                  {/* Arabic Text */}
                  {viewMode !== 'english' && seg.text_arabic && (
                    <p
                      dir="rtl"
                      className={`font-arabic ${arabicFontClasses} text-right transition-colors ${
                        isActive ? 'text-[#1A1918] font-bold' : 'text-[#2D2A26] group-hover:text-[#1A1918]'
                      }`}
                    >
                      {renderArabicText(seg.text_arabic)}
                    </p>
                  )}

                  {/* English Text */}
                  {viewMode !== 'arabic' && seg.text_english && (
                    <p
                      className={`${englishFontClasses} mt-2.5 font-sans transition-colors ${
                        isActive ? 'text-[#3D3A35] font-medium' : 'text-[#636059] group-hover:text-[#45423C]'
                      }`}
                    >
                      {seg.text_english}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-[#636059] font-arabic text-xl" dir="rtl">
              {story.title_arabic}
            </div>
          )}
        </div>
      </main>

      {/* Lexicon Modal */}
      <VocabularyModal gloss={selectedGloss} onClose={() => setSelectedGloss(null)} />
    </div>
  );
}
