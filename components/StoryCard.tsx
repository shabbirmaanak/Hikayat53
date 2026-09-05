'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { StoryMetadata } from '@/lib/db';

interface StoryCardProps {
  story: StoryMetadata;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link
      href={`/story/${story.id}`}
      className="group block bg-[#FFFFFF] hover:bg-[#FDFCF9] border border-[#E7E2D8] hover:border-[#C9BEAB] rounded-xl p-5 sm:p-6 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Category & Segment Count */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C8578]">
          <span className="uppercase tracking-wider font-semibold text-[#92400E]">
            {story.category}
          </span>
          {story.segment_count ? (
            <>
              <span>·</span>
              <span>{story.segment_count} paragraphs</span>
            </>
          ) : null}
        </div>

        {/* Minimal Arrow indicator */}
        <ArrowUpRight className="w-4 h-4 text-[#B5AEA1] group-hover:text-[#92400E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>

      {/* Titles */}
      <div className="mt-4 space-y-1.5">
        <h2
          dir="rtl"
          className="text-2xl sm:text-3xl font-arabic font-bold text-[#1A1918] group-hover:text-[#92400E] transition-colors leading-relaxed"
        >
          {story.title_arabic}
        </h2>
        {story.title_english && (
          <h3 className="text-sm font-semibold text-[#3D3A35]">
            {story.title_english}
          </h3>
        )}
      </div>

      {/* Moral Theme */}
      {story.moral_theme && (
        <p className="mt-2.5 text-xs text-[#636059] font-sans leading-relaxed line-clamp-2">
          {story.moral_theme}
        </p>
      )}
    </Link>
  );
}
