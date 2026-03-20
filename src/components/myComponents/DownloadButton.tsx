// components/DownloadButton.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, Loader2 } from 'lucide-react';

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

  const handleDownload = async (sizeValue: string, unsplashField: string) => {
    setDownloading(true);

    try {
      if (photoUrls && photoUrls[unsplashField as keyof typeof photoUrls]) {
        const imageUrl = photoUrls[unsplashField as keyof typeof photoUrls];
        await forceDownload(imageUrl, `unsplash-${photoId}-${sizeValue}.jpg`);
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
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Button container with rounded corners */}
      <div className="flex rounded-lg overflow-hidden border hover:border-black border-gray-300 transition-colors duration-200">
        
        {/* Download button */}
        <button
          onClick={() => handleDownload('medium', 'regular')}
          disabled={downloading}
          className="px-4 py-2 bg-white text-gray-700 hover:text-black hover:border-black transition-all duration-200 flex items-center gap-2 min-w-[110px] justify-center cursor-pointer"
        >
          {downloading ? (
            <>
              <Spinner />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download size={16} className="hover:text-black transition-colors" />
              <span>Download</span>
            </>
          )}
        </button>
        
        {/* ✅ Arrow button with working animation and hover effect */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={downloading}
          className="px-2 py-2 bg-white text-gray-700 hover:text-black hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center justify-center group"
        >
          <ChevronDown 
            size={18} 
            className={`transition-all duration-300 ease-in-out hover:scale-110 hover:text-black ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div 
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDownload(option.value, option.unsplashField)}
                disabled={downloading}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">{option.label}</span>
                  <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">{option.dimensions}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}