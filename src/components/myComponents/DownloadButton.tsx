// components/DownloadButton.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, Loader2, Scissors } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/myComponents/Toast';
import EditPhotoModal from './EditPhotoModal';

// 📦 Size options with actual dimensions
const SIZE_OPTIONS = [
  {
    value: 'small',
    label: 'Small',
    dimensions: '640 x 887',
    unsplashField: 'small'
  },
  {
    value: 'medium',
    label: 'Medium',
    dimensions: '1920 x 2661',
    unsplashField: 'regular'
  },
  {
    value: 'large',
    label: 'Large',
    dimensions: '2400 x 3327',
    unsplashField: 'full'
  },
  {
    value: 'original',
    label: 'Original Size',
    dimensions: '5152 x 7142',
    unsplashField: 'raw'
  },
];

interface DownloadButtonProps {
  photoId: string;
  photoUrls?: {
    small: string;
    regular: string;
    full: string;
    raw: string;
  };
  className?: string;
}

// ✅ Spinner with Lucide Loader2
const Spinner = () => {
  return (
    <Loader2 className="w-4 h-4 animate-spin text-gray-900" strokeWidth={3} />
  );
};

export default function DownloadButton({
  photoId,
  photoUrls,
  className = ''
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const forceDownload = async (url: string, filename: string) => {
    try {
      // ⏳ Artificial delay to see spinner
      await new Promise(resolve => setTimeout(resolve, 1500));

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

  const handleDownload = async (sizeValue: string, unsplashField: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // ✅ Auth check - User must be logged in to download
    if (status !== 'authenticated') {
      toast.error('Please login to download photos');
      // setTimeout(() => router.push('/login'), 1500);
      return;
    }

    setDownloading(true);

    try {
      if (photoUrls && photoUrls[unsplashField as keyof typeof photoUrls]) {
        const imageUrl = photoUrls[unsplashField as keyof typeof photoUrls];
        await forceDownload(imageUrl, `unsplash-${photoId}-${sizeValue}.jpg`);

        // Track download
        await fetch('/api/user/downloads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoId,
            photoData: {
              url: imageUrl,
              size: sizeValue,
              downloadedAt: new Date()
            }
          })
        });

        toast.success('Download started!');
      } else {
        const response = await fetch(`/api/unsplash/download/${photoId}?size=${sizeValue}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `unsplash-${photoId}-${sizeValue}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);

        // Track download
        await fetch('/api/user/downloads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoId,
            photoData: {
              url: `/api/unsplash/download/${photoId}?size=${sizeValue}`,
              size: sizeValue,
              downloadedAt: new Date()
            }
          })
        });

        toast.success('Download started!');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
      setIsOpen(false);
    }
  };

  const handleMainDownload = (e: React.MouseEvent) => {
    handleDownload('medium', 'regular', e);
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Button container with rounded corners */}
      <div className="flex rounded border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 bg-white dark:bg-transparent overflow-hidden h-[38px]">

        {/* Download button */}
        <button
          onClick={handleMainDownload}
          disabled={downloading}
          className="pl-3 pr-2.5 bg-transparent text-gray-700 dark:text-gray-400 font-bold text-[13px] hover:text-black dark:hover:text-white transition-all duration-200 flex items-center gap-2 border-r border-gray-200 dark:border-gray-800 cursor-pointer h-full"
          aria-label={downloading ? "Downloading photo" : "Download photo"}
        >
          {downloading ? (
            <>
              <Spinner />
              <span className="text-[13px]">Downloading...</span>
            </>
          ) : (
            <>
              <span className="text-[13px]">Download</span>
            </>
          )}
        </button>

        {/* ✅ Arrow button with working animation and hover effect */}
        <button
          onClick={handleDropdownToggle}
          disabled={downloading}
          className="px-2.5 bg-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 cursor-pointer flex items-center justify-center h-full"
          aria-label="Open download size options"
          aria-expanded={isOpen}
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={handleBackdropClick}
          />

          <div className="absolute right-0 z-50 mt-1.5 w-64 bg-white dark:bg-[#111111] rounded shadow-xl border border-gray-200 dark:border-gray-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={(e) => handleDownload(option.value, option.unsplashField, e)}
                disabled={downloading}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{option.label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{option.dimensions}</span>
                </div>
              </button>
            ))}

            <div className="my-1.5 border-t border-gray-100 dark:border-gray-800" />

            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditOpen(true); setIsOpen(false); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group cursor-pointer flex items-center gap-3"
            >
                <Scissors size={16} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white">Edit & Custom Resize</span>
            </button>
          </div>
        </>
      )}

      {/* ✂️ Edit Modal */}
      {isEditOpen && photoUrls && (
        <EditPhotoModal 
            photo={{
                id: photoId,
                urls: photoUrls,
                width: 4000, // Fallback if regular not available, ideally pass original dims
                height: 3000
            }}
            onClose={() => setIsEditOpen(false)}
            onDownload={(url, filename) => {
                forceDownload(url, filename);
                setIsEditOpen(false);
            }}
        />
      )}
    </div>
  );
}