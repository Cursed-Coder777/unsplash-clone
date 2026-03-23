import { Bookmark, Plus, Wand2, Info, MoreHorizontal, Calendar, CircleCheck, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DownloadButton from '@/components/myComponents/DownloadButton';
import ShareMenu from '@/components/myComponents/ShareMenu';
import ScrollToTop from '@/components/myComponents/ScrollToTop';
import BookmarkButton from '@/components/myComponents/BookmarkButton';
import LikeButton from '@/components/myComponents/LikeButton';

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

async function getTotalLikes(photoId: string): Promise<number> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/unsplash/photo/${photoId}/like`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return data.likesCount ?? 0;
  } catch (error) {
    console.error('Failed to fetch likes:', error);
    return 0;
  }
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

  // ✅ Fetch total likes from database
  const totalLikes = await getTotalLikes(id);

  return (
    <div className="bg-white min-h-screen pb-20">
      <ScrollToTop />
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-6">

        {/* 👤 Header Section - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Image
              src={photo.user.profile_image.small}
              alt={photo.user.username}
              width={32}
              height={32}
              className="rounded-full w-8 h-8 object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-900 leading-tight">{photo.user.name}</span>
              <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">@{photo.user.username}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg divide-x divide-gray-300 overflow-hidden">
              {/* ❤️ Like Button with total likes */}
              <LikeButton
                photoId={photo.id}
                initialLikesCount={totalLikes}
                size={24}
              />
              <BookmarkButton photoId={photo.id} />
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
        <div className="flex justify-center mb-8 lg:mb-12">
          <div className="relative w-full flex justify-center bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={photo.urls.regular}
              alt={photo.alt_description || 'Photo'}
              className="max-h-[70vh] lg:max-h-[85vh] w-auto h-full object-contain shadow-sm"
            />
          </div>
        </div>

        {/* 📊 Stats Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div className="flex flex-col">
              <span className="text-xs lg:text-sm font-medium text-gray-400 mb-1">Views</span>
              <span className="text-base lg:text-lg font-bold">{(photo.views || 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs lg:text-sm font-medium text-gray-400 mb-1">Downloads</span>
              <span className="text-base lg:text-lg font-bold">{(photo.downloads || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ShareMenu shareUrl={shareUrl} />
            <button className="flex items-center gap-2 border rounded-lg border-gray-200 px-3 py-1.5 text-xs lg:text-sm font-medium text-gray-500 hover:border-black hover:text-black transition">
              <Info size={16} />
              <span className="hidden sm:inline">Info</span>
            </button>
            <button className="p-2 border border-gray-200 rounded text-gray-500 hover:border-black hover:text-black transition">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* 📅 Meta Section */}
        <div className="py-6 space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Calendar size={16} className="text-gray-400" />
            <span>{formatDate(photo.created_at)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <CircleCheck size={16} className="text-green-500" />
            <span>Free to use under the <Link href="#" className="underline">Unsplash License</Link></span>
          </div>
        </div>

        {/* 🏷️ Tags Section */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {(photo.tags || []).map((tag, i) => (
              <Link
                key={i}
                href={`/home?q=${encodeURIComponent(tag.title)}`}
                className="bg-gray-100 px-3 py-1.5 rounded text-xs lg:text-sm text-gray-600 font-medium hover:bg-gray-200 cursor-pointer transition capitalize"
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