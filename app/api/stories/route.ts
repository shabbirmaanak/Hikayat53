import { NextRequest, NextResponse } from 'next/server';
import { getAllStories, searchStories } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    let stories;
    if (query && query.trim()) {
      stories = await searchStories(query.trim());
    } else {
      stories = await getAllStories(category || undefined);
    }

    return NextResponse.json(
      { stories, total: stories.length },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch stories';
    console.error('API /api/stories error:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
