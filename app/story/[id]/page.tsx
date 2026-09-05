import React from 'react';
import Link from 'next/link';
import { getStoryById } from '@/lib/db';
import HikayatReader from '@/components/HikayatReader';
import { ArrowLeft, BookX } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] text-[#1A1918] p-4">
        <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E7E2D8] rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <BookX className="w-12 h-12 text-[#92400E] mx-auto" />
          <h1 className="text-xl font-bold text-[#1A1918]">حكاية غير موجودة</h1>
          <p className="text-xs text-[#636059] font-mono">
            The requested story ID <code className="text-[#92400E]">"{id}"</code> was not found in the Turso database.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#B45309] text-white font-bold rounded-xl text-xs font-mono hover:bg-[#92400E] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Library</span>
          </Link>
        </div>
      </div>
    );
  }

  return <HikayatReader story={story} />;
}
