import { NextRequest, NextResponse } from 'next/server';
import { getStoryById } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    const story = await getStoryById(id);
    if (!story) {
      return NextResponse.json({ error: 'Hikayat story not found' }, { status: 404 });
    }

    return NextResponse.json(story, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('API /api/stories/[id] error:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
