import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E2D8] bg-[#FBF9F5] text-[#1A1918] mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C8578] font-mono gap-3">
        <div className="flex items-center gap-2">
          <span className="font-arabic text-[#92400E] font-bold text-base">حكاية</span>
          <span>·</span>
          <span>Hikayat</span>
        </div>

        <p className="text-[11px] text-[#A39C90]">
          Turso libSQL & Cloudflare R2
        </p>
      </div>
    </footer>
  );
}
