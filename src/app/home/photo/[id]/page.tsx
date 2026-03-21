// src/app/home/photo/[id]/page.tsx
import { Bookmark, Plus, Wand2, Info, MoreHorizontal, Calendar, Disc, CircleCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DownloadButton from '@/components/myComponents/DownloadButton';
import ShareMenu from '@/components/myComponents/ShareMenu';

interface Props {
  params: Promise<{ id: string }>;
}

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    full: string;
    raw: string;
  };
  alt_description: string | null;
  description: string | null;
  created_at: string;
  user: {
    username: string;
    name: string;
    profile_image: { small: string };
    for_hire: boolean;
  };
  views: number;
  downloads: number;
  likes: number;
  width: number;
  height: number;
  tags: Array<{ title: string }>;
}

async function getPhoto(id: string) {
  const res = await fetch(
    `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  return res.json();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return `Published ${diffDays} days ago`;
  if (diffDays < 30) return `Published ${Math.floor(diffDays / 7)} weeks ago`;
  return `Published on ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
}


export default async function PhotoPage({ params }: Props) {
  const { id } = await params;
  const photo: UnsplashPhoto | null = await getPhoto(id);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/home/photo/${id}`;

  if (!photo) return notFound();

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">

        {/* 👤 Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image
              src={photo.user.profile_image.small}
              alt={photo.user.username}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex flex-col -space-y-1">
              <span className="font-bold text-sm text-gray-900 leading-tight">{photo.user.name}</span>
              <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">{photo.user.username}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300  rounded-lg divide-x divide-gray-300 overflow-hidden">
              <button className="px-3 py-2 text-gray-500  hover:text-black hover:bg-gray-50 transition">
                <Bookmark size={18} />
              </button>
              <button className="px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition">
                <Plus size={18} />
              </button>
            </div>

            <button className="hidden md:flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:border-black hover:text-black transition">
              <Wand2 size={16} />
              <span>Edit image</span>
              <ChevronDown size={14} />
            </button>

            <DownloadButton
              photoId={photo.id}
              photoUrls={{
                small: photo.urls.small,
                regular: photo.urls.regular,
                full: photo.urls.full,
                raw: photo.urls.raw
              }}
            />
          </div>
        </div>

        {/* 🖼️ Main Image Section */}
        <div className="flex justify-center mb-10">
          <div className="relative group cursor-zoom-in">
            <Image
              src={photo.urls.regular}
              alt={photo.alt_description || 'Photo'}
              width={100}
              height={100}
              className="max-h-185 min-w-185"

            />
          </div>
        </div>

        {/* 📊 Stats Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-gray-100 pb-10">
          <div className="flex gap-16">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-1">Views</span>
              <span className="text-lg font-bold">{(photo.views || 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-1">Downloads</span>
              <span className="text-lg font-bold">&nbsp;&nbsp;{(photo.downloads || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShareMenu shareUrl={shareUrl} />
            <button className="flex items-center gap-2 border rounded-lg border-gray-200 px-3 py-1.5  text-sm font-medium text-gray-500 hover:border-black hover:text-black transition">
              <Info size={16} />
              <span>Info</span>
            </button>
            <button className="p-2 border border-gray-200 rounded text-gray-500 hover:border-black hover:text-black transition">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* 📅 Meta Section */}
        <div className="py-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} className="text-gray-400" />
            <span>{formatDate(photo.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CircleCheck size={16} className="text-gray-400 fill-gray-100" />
            <span>Free to use under the <Link href="#" className="underline">Unsplash License</Link></span>
          </div>
        </div>

        {/* 🏷️ Tags Section */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {(photo.tags || []).map((tag, i) => (
              <Link
                key={i}
                href={`/home?q=${encodeURIComponent(tag.title)}`}
                className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600 font-medium hover:bg-gray-200 cursor-pointer transition capitalize"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)