'use client';
import { Bookmark, Plus, Info, MoreHorizontal, Calendar, CircleCheck, ChevronDown, Scissors, X, ChevronLeft, ChevronRight, Share2, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import DownloadButton from '@/components/myComponents/DownloadButton';
import ShareMenu from '@/components/myComponents/ShareMenu';
import BookmarkButton from '@/components/myComponents/BookmarkButton';
import LikeButton from '@/components/myComponents/LikeButton';
import Tooltip from '@/components/myComponents/Tooltip';
import EditPhotoModal from '@/components/myComponents/EditPhotoModal';

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
  color: string | null;
  tags: Array<{ title: string }>;
  exif?: {
    make: string | null;
    model: string | null;
    exposure_time: string | null;
    aperture: string | null;
    focal_length: string | null;
    iso: number | null;
  };
  location?: {
    name: string | null;
    city: string | null;
    country: string | null;
  };
}

interface PhotoDetailProps {
  photo: UnsplashPhoto;
  isModal?: boolean;
  onClose?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  totalLikes?: number;
}

export default function PhotoDetail({ photo, isModal, onClose, onNext, onPrev, totalLikes = 0 }: PhotoDetailProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [relatedPhotos, setRelatedPhotos] = React.useState<UnsplashPhoto[]>([]);
  const [loadingRelated, setLoadingRelated] = React.useState(false);

  // 🔄 Reset loading state whenever the photo changes
  React.useEffect(() => {
    setIsLoaded(false);
    fetchRelated();
  }, [photo.id]);

  const fetchRelated = async () => {
    setLoadingRelated(true);
    try {
      const res = await fetch(`/api/unsplash/photos/${photo.id}/related`);
      const data = await res.json();
      setRelatedPhotos(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRelated(false);
    }
  };

  // ⌨️ Keyboard Navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'Escape' && onClose) onClose();

      // 'L' to Like - find the like button and click it to reuse logic
      if (e.key.toLowerCase() === 'l') {
        const likeBtn = document.querySelector('[aria-label="Like photo"]') as HTMLButtonElement;
        if (likeBtn) likeBtn.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext, onClose]);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/photos/${photo.id}` : '';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleEditDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  const content = (
    <div className={`bg-white dark:bg-black w-full mx-auto overflow-y-auto outline-none transition-all duration-300 ${isModal ? 'max-w-[1320px] rounded-lg max-h-[92vh] relative z-20 shadow-2xl' : 'max-w-full min-h-screen pb-20'}`}>
      {/* 👤 Header Section - Fixed at top of card */}
      <div className="sticky top-0 z-30 bg-white dark:bg-black px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/users/${photo.user.username}`} className="flex items-center gap-3 group">
            <Image
              src={photo.user.profile_image.small}
              alt={photo.user.username}
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover border dark:border-gray-800 transition-opacity group-hover:opacity-80"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 translate-y-0.5">
              <Link href={`/users/${photo.user.username}`} className="font-bold text-sm text-gray-900 dark:text-white leading-tight hover:underline">
                {photo.user.name}
              </Link>
              {photo.user.for_hire && (
                <span className="text-[10px] text-blue-500 font-semibold flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                  Available for hire
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">@{photo.user.username}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="flex items-center gap-2">
            <Tooltip text="Bookmark">
              <BookmarkButton photoId={photo.id} className="border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 h-[38px] w-[44px] flex items-center justify-center transition-all bg-white dark:bg-transparent" />
            </Tooltip>
            <Tooltip text="Add to Collection">
              <button className="border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 h-[38px] w-[44px] flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition bg-white dark:bg-transparent">
                <Plus size={20} />
              </button>
            </Tooltip>
          </div>

          <button 
            onClick={() => setIsEditOpen(true)}
            className="hidden md:flex items-center gap-2 border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:border-gray-400 dark:hover:border-gray-600 hover:text-black dark:hover:text-white transition bg-white dark:bg-transparent"
          >
            <span>Edit image</span>
            <ChevronDown size={14} />
          </button>

          <DownloadButton
            photoId={photo.id}
            photoUrls={photo.urls}
          />
        </div>
      </div>

      <div className={`${isModal ? 'px-4 md:px-0 pb-6' : 'max-w-full px-4 lg:px-8 pt-4 pb-10'}`}>
        {/* 🖼️ Main Image Section - Center focused */}
        <div className="flex justify-center relative w-full mb-8 min-h-[40vh]">
          <div
            className={`relative flex justify-center transition-all duration-500 mx-auto overflow-hidden ${isModal ? 'bg-gray-50 dark:bg-[#111111] rounded-sm' : 'bg-white dark:bg-[#0a0a0a]'}`}
            style={{
              aspectRatio: `${photo.width} / ${photo.height}`,
              maxHeight: isModal ? '80vh' : 'auto',
              width: '100%', // Fill width to allow height calculation from aspectRatio
              maxWidth: isModal ? 'min(90%, 1000px)' : '1200px',
              margin: '0 auto',
            }}
          >
            {/* Blurred Placeholder + Dominant Color - Visible until main image loads */}
            <div
              className={`absolute inset-0 z-0 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
              style={{ backgroundColor: photo.color || 'transparent' }}
            >
              <Image
                src={photo.urls.small}
                alt="placeholder"
                fill
                className="object-cover blur-2xl opacity-50 scale-105"
                aria-hidden="true"
              />
            </div>

            <Image
              src={photo.urls.regular}
              alt={photo.alt_description || 'Photo'}
              fill
              onLoad={() => setIsLoaded(true)}
              className={`relative z-10 w-full h-full object-contain transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isModal ? '' : 'shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>
        </div>

        {/* 📅 Meta Section - Before Stats on full page to match Unsplash */}
        {!isModal && (
          <div className="py-6 space-y-4 max-w-full">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} className="text-gray-400" />
              <span>Published on {formatDate(photo.created_at)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <CircleCheck size={16} className="text-green-500" />
              <span>Free to use under the <Link href="#" className="underline">Unsplash License</Link></span>
            </div>
          </div>
        )}

        {/* 📊 Content Footer - Match Screenshot 5/6 */}
        <div className="px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Views</span>
              <span className="text-base font-bold dark:text-gray-200">{(photo.views || '--').toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Downloads</span>
              <span className="text-base font-bold dark:text-gray-200">{(photo.downloads || '--').toLocaleString()}</span>
            </div>
          </div>

          {/* Middle Section: Tags/Feature label */}
          <div className="hidden lg:flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-1">Featured in</span>
            <div className="flex gap-1.5">
              {photo.tags?.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[13px] font-bold dark:text-gray-300">
                  {tag.title}{i < 2 && ','}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border rounded border-gray-200 dark:border-gray-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black dark:hover:text-white transition hover:border-gray-400 dark:hover:border-gray-600">
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={() => setIsInfoOpen(true)}
              className="flex items-center gap-2 border rounded border-gray-200 dark:border-gray-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black dark:hover:text-white transition hover:border-gray-400 dark:hover:border-gray-600"
            >
              <Info size={16} /> Info
            </button>
            <button className="p-2 border border-gray-200 dark:border-gray-800 rounded text-gray-500 hover:border-black dark:hover:border-white transition">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* 🏷️ Tags Section - Full page style */}
        <div className="mt-8 pb-10">
          <div className="flex flex-wrap gap-2">
            {(photo.tags || []).map((tag, i) => (
              <Link
                key={i}
                href={`/home?q=${encodeURIComponent(tag.title)}`}
                className="bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition capitalize border border-transparent dark:border-gray-800"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </div>

        {/* ℹ️ Info Modal */}
        {isInfoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsInfoOpen(false)} />
            <div className="relative bg-white dark:bg-[#111111] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold dark:text-white">Photo Info</h3>
                <button onClick={() => setIsInfoOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-1">Make</span>
                    <span className="text-sm font-bold dark:text-gray-200">{photo.exif?.make || '--'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-1">Model</span>
                    <span className="text-sm font-bold dark:text-gray-200">{photo.exif?.model || '--'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-1">Shutter Speed</span>
                    <span className="text-sm font-bold dark:text-gray-200">{photo.exif?.exposure_time ? `${photo.exif.exposure_time}s` : '--'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-1">Aperture</span>
                    <span className="text-sm font-bold dark:text-gray-200">{photo.exif?.aperture ? `f/${photo.exif.aperture}` : '--'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-1">Focal Length</span>
                    <span className="text-sm font-bold dark:text-gray-200">{photo.exif?.focal_length ? `${photo.exif.focal_length}mm` : '--'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block mb-1">ISO</span>
                    <span className="text-sm font-bold dark:text-gray-200">{photo.exif?.iso || '--'}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Published on {formatDate(photo.created_at)}</span>
                  </div>
                  {photo.location?.name && (
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{photo.location.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📸 Related Photos Section - Professional Unsplash Style */}
      <div className="mt-20 pt-16 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-bold dark:text-white mb-10 tracking-tight">Related photos</h3>
        {loadingRelated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {relatedPhotos.map((p) => (
              <Link
                key={p.id}
                href={`/photos/${p.id}`}
                className="group flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm group-hover:shadow-xl transition-shadow">
                  <Image
                    src={p.urls.small}
                    alt={p.alt_description || ""}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 px-1">
                  <Image
                    src={p.user.profile_image.small}
                    alt={p.user.name}
                    width={24}
                    height={24}
                    className="rounded-full w-6 h-6 object-cover"
                  />
                  <span className="text-xs font-medium text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">{p.user.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* ✂️ Edit Modal */}
      {isEditOpen && (
        <EditPhotoModal 
          photo={{
            id: photo.id,
            urls: photo.urls,
            width: photo.width,
            height: photo.height
          }}
          onClose={() => setIsEditOpen(false)}
          onDownload={(url, filename) => {
            handleEditDownload(url, filename);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:px-16 overflow-hidden">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />

        {/* ❌ Outside Close Button - Top Left of Screen */}
        <button
          onClick={onClose}
          className="fixed top-4 left-4 z-[70] p-1.5 text-white/70 hover:text-white transition-colors group"
          aria-label="Close modal"
        >
          <div className="bg-black/20 group-hover:bg-black/40 rounded p-1 transition-colors">
            <X size={28} strokeWidth={1.5} />
          </div>
        </button>

        {/* ⬅️ Outside Prev Arrow */}
        {onPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-[70] p-4 text-white/50 hover:text-white transition-all group"
          >
            <ChevronLeft size={48} strokeWidth={1.2} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        {/* ➡️ Outside Next Arrow */}
        {onNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[70] p-4 text-white/50 hover:text-white transition-all group"
          >
            <ChevronRight size={48} strokeWidth={1.2} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {content}
      </div>
    );
  }

  return content;
}
