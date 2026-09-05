'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { StoryMetadata } from '@/lib/db';
import StoryCard from './StoryCard';

interface StoryGridProps {
  initialStories: StoryMetadata[];
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'wisdom', label: 'Wisdom · حكمة' },
  { id: 'parable', label: 'Parables · أمثال' },
  { id: 'akhlaaq', label: 'Morals · أخلاق' },
  { id: 'tarikh', label: 'History · تاريخ' },
];

export default function StoryGrid({ initialStories }: StoryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = useMemo(() => {
    return initialStories.filter((story) => {
      const matchesCategory =
        selectedCategory === 'all' || story.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        story.title_arabic.toLowerCase().includes(q) ||
        story.title_english.toLowerCase().includes(q) ||
        story.moral_theme.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [initialStories, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E7E2D8] pb-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#EAE4D9] text-[#78350F] font-semibold shadow-xs'
                    : 'text-[#636059] hover:text-[#1A1918] hover:bg-[#F2EDE4]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-[#9C978D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#E7E2D8] hover:border-[#D5CEC2] focus:border-[#B45309] rounded-lg text-xs text-[#1A1918] placeholder-[#9C978D] focus:outline-none transition shadow-xs"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-[#E7E2D8] bg-[#FFFFFF] rounded-xl p-8 space-y-2">
          <p className="text-sm text-[#1A1918] font-medium">No stories found</p>
          <p className="text-xs text-[#636059]">
            Try adjusting your search query or filter.
          </p>
        </div>
      )}
    </div>
  );
}
