'use client';

import React from 'react';
import { X } from 'lucide-react';
import { VocabularyGloss } from '@/lib/db';

interface VocabularyModalProps {
  gloss: VocabularyGloss | null;
  onClose: () => void;
}

export default function VocabularyModal({ gloss, onClose }: VocabularyModalProps) {
  if (!gloss) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-6 shadow-2xl space-y-4 text-[#1A1918]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C8578]">
            Lexicon · المعجم والاشتقاق
          </span>
          <button
            onClick={onClose}
            className="p-1 text-[#8C8578] hover:text-[#1A1918] transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Word and Transliteration */}
        <div className="text-center py-2 space-y-1">
          <p className="text-3xl sm:text-4xl font-arabic font-bold text-[#92400E]" dir="rtl">
            {gloss.word_arabic}
          </p>
          <p className="text-xs font-mono text-[#636059]">
            {gloss.transliteration}
          </p>
        </div>

        {/* Root Letters */}
        {gloss.root_letters && (
          <div className="flex items-center justify-between bg-[#F7F5F0] px-3.5 py-2.5 rounded-lg border border-[#E7E2D8]">
            <span className="text-xs font-mono text-[#7A7468]">
              Root (الجذر)
            </span>
            <span className="font-arabic font-bold text-sm text-[#1A1918] tracking-widest" dir="rtl">
              {gloss.root_letters}
            </span>
          </div>
        )}

        {/* Meaning */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#8C8578] uppercase tracking-wider">
            Meaning & Context
          </span>
          <p className="text-xs leading-relaxed text-[#3D3A35] bg-[#F7F5F0] p-3.5 rounded-lg border border-[#E7E2D8]">
            {gloss.definition}
          </p>
        </div>
      </div>
    </div>
  );
}
