// app/home/(.)photo/[id]/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { X } from 'lucide-react';

interface UnsplashPhoto {
  id: string;
  urls: { regular: string; small: string };
  alt_description: string | null;
  width: number;
  height: number;
}

export default function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  const { id } = React.use(params);
  
  const [photo, setPhoto] = React.useState<UnsplashPhoto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchPhoto = async () => {
      if (!id) {
        setError('Photo ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        
        const res = await fetch(`/api/unsplash/photo/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch photo');
        }
        
        const data = await res.json();
        setPhoto(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load photo');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhoto();
  }, [id]);

  const handleClose = () => router.back();

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!photo) return null;

  // Calculate image dimensions (same as photo page)
  const imageWidth = photo.width / 7;
  const imageHeight = photo.height / 7;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 z-50"
        onClick={handleClose}
      />
      
      {/* Modal Container - Only Image */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className="relative pointer-events-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          >
            <X size={28} />
          </button>

          {/* Only Image */}
          <img
            src={photo.urls.regular}
            alt={photo.alt_description || 'Photo'}
            width={imageWidth}
            height={imageHeight}
            className="rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      </div>
    </>
  );
}