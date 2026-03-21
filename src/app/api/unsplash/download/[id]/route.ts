// app/api/unsplash/download/[id]/route.ts
import { NextResponse } from 'next/server';

// 🗺️ Size to Unsplash URL field mapping
const SIZE_TO_FIELD: Record<string, string> = {
  small: 'small',
  medium: 'regular',
  large: 'full',
  original: 'raw',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const size = url.searchParams.get('size') || 'original';

    // Map size to Unsplash URL field
    const field = SIZE_TO_FIELD[size] || 'regular';

    // 1️⃣ Get photo details from Unsplash
    const photoRes = await fetch(
      `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!photoRes.ok) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const photo = await photoRes.json();
    const imageUrl = photo.urls[field];

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL not found' }, { status: 404 });
    }

    // 2️⃣ Track download (required by Unsplash)
    if (size !== 'small' && size !== 'medium') {
      await fetch(
        `https://api.unsplash.com/photos/${id}/download?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
        { headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
      );
    }
    // Unsplash ke rules ke mutabik large/original download pe /download endpoint hit karna mandatory hai
    // Small/medium download pe tracking nahi chahiye (waste of API calls)



    // 3️⃣ Fetch and return image
    const imageRes = await fetch(imageUrl);
    const imageBuffer = await imageRes.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="unsplash-${id}-${size}.jpg"`,
      },
    });

  } catch (error) {
    console.error('❌ Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}