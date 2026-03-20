import { ArrowDown, Bookmark, ChevronDown, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RiCheckLine } from 'react-icons/ri';

// 🎯 Props type
interface Props {
  params: Promise<{ id: string }>;
}

// 🖼️ Type definition (simplified)
interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string };
  alt_description: string | null;
  user: {
    name: string;
    profile_image: { small: string };
    for_hire: boolean;
  };
  likes: number;
  width: number;
  height: number;
  links: { download: string };
}

// 📡 Fetch photo from Unsplash
async function getPhoto(id: string) {
  const res = await fetch(
    `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params;
  const photo: UnsplashPhoto | null = await getPhoto(id);

  if (!photo) return notFound();

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* 🔙 Back button */}
      <Link href="/home" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to home
      </Link>

      {/* 👤 User info and action buttons */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={photo.user.profile_image.small}
            alt={photo.user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h1 className="font-medium text-base">{photo.user.name}</h1>
            {photo.user.for_hire && (
              <p className="text-xs text-blue-500 flex items-center gap-1">
                Available for hire
                <RiCheckLine size={11} className="bg-blue-500 text-white rounded-full" />
              </p>
            )}
          </div>
        </div>

        {/* 🔘 Action buttons */}
        <div className="flex items-center gap-2">
          <button className="border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <Bookmark size={18} />
          </button>
          <button className="border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus size={18} />
          </button>

          {/* ⬇️ Download button with tooltip */}
          <div className="flex">
            <a
              href={`/api/unsplash/download/${photo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 px-4 py-1.5 rounded-l-lg hover:bg-gray-50 transition-colors"
            >
              Download
            </a>
            <button className="border border-gray-300 px-3 py-1.5 rounded-r-lg border-l-0 hover:bg-gray-50 transition-colors">
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 🖼️ Main image */}
      <div className="w-full flex items-center justify-center">
        <Image
          src={photo.urls.regular}
          alt={photo.alt_description || 'Photo'}
          width={photo.width / 8}
          height={photo.height / 8}
          className="rounded-lg max-w-full h-auto object-contain"
        />
      </div>

      {/* 📊 Photo stats */}
      <div className="flex gap-6 mt-6 justify-center">
        <div>
          <p className="font-semibold">{photo.likes.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Likes</p>
        </div>
        <div>
          <p className="font-semibold">{photo.width} × {photo.height}</p>
          <p className="text-sm text-gray-500">Dimensions</p>
        </div>
      </div>
    </div>
  );
}