import { Metadata } from 'next';
import HomeClient from "./HomeClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const q = searchParams.q || 'nature';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        title: `${q.charAt(0).toUpperCase() + q.slice(1)} Photos | Unsplash Clone`,
        description: `Explore high-quality ${q} photos on Unsplash Clone. Download beautiful, free images in high resolution.`,
        keywords: `${q}, photos, images, free, download, unsplash clone`,
        openGraph: {
            title: `${q} Photos | Unsplash Clone`,
            description: `Browse the best collection of ${q} images.`,
            url: `${siteUrl}/home?q=${q}`,
            siteName: 'Unsplash Clone',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200',
                    width: 1200,
                    height: 630,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        alternates: {
            canonical: `${siteUrl}/home?q=${q}`,
        },
    };
}

async function getInitialPhotos(query: string, page: string = '1', order_by: string = 'relevant') {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
        console.error("Missing UNSPLASH_ACCESS_KEY");
        return [];
    }

    try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20&order_by=${order_by}`;
        const res = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${accessKey}`
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data.results || [];
    } catch (e) {
        console.error("Fetch failed", e);
        return [];
    }
}

export default async function HomePage(props: { searchParams: Promise<{ q?: string, ai?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams.q || 'nature';
    const isAiEnabled = searchParams.ai === 'true';

    // Prefetch first 20 photos on the server
    const initialPhotos = await getInitialPhotos(q);

    return (
        <main id="main-content">
            <HomeClient 
                initialPhotos={initialPhotos} 
                q={q} 
                aiSearch={isAiEnabled} 
            />
        </main>
    );
}