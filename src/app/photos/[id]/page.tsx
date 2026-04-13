import { notFound } from 'next/navigation';
import PhotoDetail from '@/components/myComponents/PhotoDetail';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

async function getPhoto(id: string) {
  const res = await fetch(
    `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhoto(id);
  if (!photo) return { title: 'Photo Not Found' };
  const title = photo.alt_description || photo.description || `Photo by ${photo.user.name}`;
  return {
    title: `${title} | Unsplash Clone`,
    description: photo.description || `Download this high-quality photo by ${photo.user.name} on Unsplash Clone.`,
    openGraph: {
      images: [{ url: photo.urls.regular }],
    },
  };
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params;
  const photo = await getPhoto(id);

  if (!photo) return notFound();

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <PhotoDetail photo={photo} />
    </div>
  );
}
