'use client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import PhotoDetail from '@/components/myComponents/PhotoDetail';

export default function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [photo, setPhoto] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [photoIds, setPhotoIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Load IDs from sessionStorage
    const stored = sessionStorage.getItem('current_photo_ids');
    if (stored) {
      setPhotoIds(JSON.parse(stored));
    }
  }, []);

  React.useEffect(() => {
    const fetchPhoto = async () => {
      try {
        // Try to get from cache first for instant feel
        const cache = sessionStorage.getItem('photo_cache');
        if (cache) {
          const cacheData = JSON.parse(cache);
          if (cacheData[id]) {
            setPhoto(cacheData[id]);
            setLoading(false); // We have enough for first render
            // But we still fetch the full details in background for stats
          }
        }

        const res = await fetch(`/api/unsplash/photo/${id}`);
        if (!res.ok) throw new Error('Failed to fetch photo');
        const data = await res.json();
        setPhoto(data);
      } catch (err) {
        if (!photo) setError(err instanceof Error ? err.message : 'Error loading photo');
      } finally {
        setLoading(false);
      }
    };
    fetchPhoto();
  }, [id]);

  const handleClose = () => router.back();

  const navigateTo = (newId: string) => {
    router.replace(`/photos/${newId}`, { scroll: false });
  };

  const onNext = () => {
    const idx = photoIds.indexOf(id);
    if (idx !== -1 && idx < photoIds.length - 1) {
      navigateTo(photoIds[idx + 1]);
    }
  };

  const onPrev = () => {
    const idx = photoIds.indexOf(id);
    if (idx !== -1 && idx > 0) {
      navigateTo(photoIds[idx - 1]);
    }
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [id, photoIds]);

  if (loading && !photo) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error || !photo) return null;

  return (
    <PhotoDetail 
      photo={photo} 
      isModal 
      onClose={handleClose}
      onNext={photoIds.indexOf(id) < photoIds.length - 1 ? onNext : undefined}
      onPrev={photoIds.indexOf(id) > 0 ? onPrev : undefined}
    />
  );
}
