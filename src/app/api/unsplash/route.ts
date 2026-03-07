import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || 'nature';
        const page = searchParams.get('page') || '1';

        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=20`,
            {
                headers: {
                    'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        if (!res.ok) {
            throw new Error('Unsplash API error');
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}