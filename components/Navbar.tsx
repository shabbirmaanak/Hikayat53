'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E7E2D8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-arabic font-bold text-2xl text-[#92400E] group-hover:text-[#B45309] transition">
            حكاية
          </span>
          <span className="text-xs text-[#C5BEB2] font-mono">/</span>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#524D44] group-hover:text-[#1A1918] transition">
            Hikayat
          </span>
        </Link>

        {/* Minimal Nav Link */}
        <div className="flex items-center gap-4 text-xs font-mono text-[#7A7468]">
          <Link
            href="/"
            className="hover:text-[#1A1918] transition"
          >
            Library
          </Link>
          <span className="text-[#D5CEC2]">•</span>
          <span className="text-[11px] text-[#8C8578]">
            Bilingual Reader
          </span>
        </div>
      </div>
    </header>
  );
}
