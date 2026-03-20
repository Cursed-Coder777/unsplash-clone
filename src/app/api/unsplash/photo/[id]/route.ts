import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ API route mein bhi await params karo
    const { id } = await params;
    
    console.log('📸 Fetching photo:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      console.log('❌ Unsplash API error:', response.status);
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    const data = await response.json();
    
    if (!data.urls || !data.urls.regular) {
      return NextResponse.json(
        { error: 'Invalid photo data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error fetching photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}