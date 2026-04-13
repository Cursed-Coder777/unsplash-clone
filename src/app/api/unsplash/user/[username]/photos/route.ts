import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  try {
    const res = await fetch(
      `https://api.unsplash.com/users/${username}/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&page=${page}&per_page=20`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error('Unsplash API error');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}
