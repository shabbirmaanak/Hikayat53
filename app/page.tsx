import React from 'react';
import { getAllStories } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StoryGrid from '@/components/StoryGrid';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let stories = [];
  let dbError = false;

  try {
    stories = await getAllStories();
  } catch (err) {
    console.error('Failed to load stories on HomePage:', err);
    dbError = true;
  }

  const isMissingEnv = !process.env.TURSO_DATABASE_URL;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1A1918]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Minimal Editorial Header */}
        <section className="space-y-3.5 text-center sm:text-left border-b border-[#E7E2D8] pb-10">
          <p className="text-xs font-mono font-semibold text-[#92400E] uppercase tracking-widest">
            Bilingual Storytelling & Morphology
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1A1918] leading-tight">
            حكايات وحِكَم <br />
            <span className="text-2xl sm:text-3xl font-normal text-[#524D44] font-sans">
              Timeless tales and classical wisdom.
            </span>
          </h1>

          <p className="text-sm text-[#636059] max-w-lg leading-relaxed">
            Explore classical Arabic parables, history, and moral tales with tap-to-reveal root morphology and parallel bilingual reading.
          </p>
        </section>

        {/* Missing Turso Credentials Banner for Vercel */}
        {isMissingEnv && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-xl space-y-2 text-xs text-[#92400E]">
            <p className="font-bold text-sm text-[#B45309]">⚙️ Vercel Environment Variables Needed</p>
            <p className="text-[#78350F]">
              To connect your live stories on Vercel, please add <code className="bg-[#FEF3C7] px-1 py-0.5 rounded font-mono">TURSO_DATABASE_URL</code> and <code className="bg-[#FEF3C7] px-1 py-0.5 rounded font-mono">TURSO_AUTH_TOKEN</code> in your <strong>Vercel Dashboard &gt; Project Settings &gt; Environment Variables</strong>, then click <strong>Redeploy</strong>.
            </p>
          </div>
        )}

        {/* Stories Catalog */}
        <section className="space-y-6">
          <StoryGrid initialStories={stories} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
