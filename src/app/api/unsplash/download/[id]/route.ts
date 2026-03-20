import { NextResponse } from 'next/server';

// 📡 GET handler for downloading photo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1️⃣ Photo ID nikaalo URL se
    const { id } = await params;

    // 2️⃣ Unsplash ke /download endpoint ko hit karo (tracking ke liye)
    //    Ye step Unsplash ke rules ke mutabik mandatory hai
    const downloadRes = await fetch(
      `https://api.unsplash.com/photos/${id}/download?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!downloadRes.ok) {
      throw new Error('Failed to trigger download');
    }

    // 3️⃣ Response mein full image URL aati hai
    const downloadData = await downloadRes.json();
    const imageUrl = downloadData.url;

    // 4️⃣ Full image ko fetch karo
    const imageRes = await fetch(imageUrl);
    const imageBuffer = await imageRes.arrayBuffer();

    // 5️⃣ Browser ko image bhejo with download headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="unsplash-${id}.jpg"`,
      },
    });

  } catch (error) {
    console.error('❌ Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}