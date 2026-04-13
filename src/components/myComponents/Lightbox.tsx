'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Calendar,
    Share2,
    Plus,
    Download,
    Heart,
    Info,
    MapPin,
    User
} from 'lucide-react';
import { UnsplashPhoto } from '@/app/home/HomeClient';
import DownloadButton from './DownloadButton';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import Tooltip from './Tooltip';
import { useSession } from 'next-auth/react';

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    photos: UnsplashPhoto[];
    initialIndex: number;
    onShare: (photo: any) => void;
    onAddToCollection: (photo: any) => void;
}

export default function Lightbox({
    isOpen,
    onClose,
    photos,
    initialIndex,
    onShare,
    onAddToCollection
}: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const { status } = useSession();
    const [showInfo, setShowInfo] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const photo = photos[currentIndex];

    const nextPhoto = useCallback(() => {
        if (currentIndex < photos.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setImgLoading(true);
        }
    }, [currentIndex, photos.length]);

    const prevPhoto = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setImgLoading(true);
        }
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, nextPhoto, prevPhoto, onClose]);

    // Touch support
    const touchStart = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextPhoto();
            else prevPhoto();
        }
        touchStart.current = null;
    };

    // Preload adjacent images
    useEffect(() => {
        if (!isOpen) return;
        if (currentIndex < photos.length - 1) {
            const nextImg = new window.Image();
            nextImg.src = photos[currentIndex + 1].urls.regular;
        }
        if (currentIndex > 0) {
            const prevImg = new window.Image();
            prevImg.src = photos[currentIndex - 1].urls.regular;
        }
    }, [currentIndex, isOpen, photos]);

    if (!isOpen || !photo) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-white dark:bg-black p-4 lg:p-8 flex flex-col animate-in fade-in duration-300"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        {photo.user.profile_image?.small && (
                            <Image
                                src={photo.user.profile_image.small}
                                alt={photo.user.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-bold dark:text-white leading-tight">{photo.user.name}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Available for hire</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Tooltip text="Like" position="bottom">
                        <LikeButton photoId={photo.id} className="bg-gray-100 dark:bg-gray-800 dark:text-gray-400" />
                    </Tooltip>
                    <Tooltip text="Bookmark" position="bottom">
                        <BookmarkButton photoId={photo.id} className="bg-gray-100 dark:bg-gray-800 dark:text-gray-400" />
                    </Tooltip>
                    <Tooltip text="Add to Collection" position="bottom">
                        <button
                            onClick={() => onAddToCollection(photo)}
                            className="bg-gray-100 dark:bg-gray-800 w-[40px] h-[32px] flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm"
                        >
                            <Plus size={18} />
                        </button>
                    </Tooltip>
                    <div className="ml-2">
                        <DownloadButton photoId={photo.id} photoUrls={photo.urls} />
                    </div>
                    <button
                        onClick={() => onShare({ id: photo.id, url: photo.urls.regular, title: photo.description || photo.alt_description })}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
                    >
                        <Share2 size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative flex items-center justify-center min-h-0">
                {/* Prev Button */}
                <button
                    onClick={prevPhoto}
                    disabled={currentIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all z-10 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <ChevronLeft size={40} />
                </button>

                {/* Next Button */}
                <button
                    onClick={nextPhoto}
                    disabled={currentIndex === photos.length - 1}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all z-10 ${currentIndex === photos.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <ChevronRight size={40} />
                </button>

                {/* Photo */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {imgLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                        </div>
                    )}
                    <Image
                        src={photo.urls.regular}
                        alt={photo.alt_description || photo.description || 'Photo'}
                        fill
                        priority
                        className={`object-contain transition-opacity duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setImgLoading(false)}
                        sizes="100vw"
                    />
                </div>
            </div>

            {/* Footer / Metadata */}
            <div className="mt-4 flex items-end justify-between">
                <div className="flex flex-col gap-2 max-w-lg">
                    {photo.description && (
                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{photo.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest font-black">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {photo.user.location || 'Unknown Location'}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> Published on {new Date(photo.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Maximize2 size={12} /> {photo.width} x {photo.height}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={`p-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border ${showInfo ? 'bg-black text-white border-black' : 'text-gray-500 border-gray-200 hover:border-black'}`}
                    >
                        <Info size={16} />
                        Info
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:border-black transition-all">
                        <Share2 size={18} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {showInfo && (
                <div className="fixed bottom-24 right-8 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-[110]">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Photo Information</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Views</p>
                                <p className="font-bold dark:text-white">--</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Downloads</p>
                                <p className="font-bold dark:text-white">--</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Technical Details</p>
                            <div className="space-y-2">
                                <p className="text-sm dark:text-gray-400">Camera: Canon EOS R5</p>
                                <p className="text-sm dark:text-gray-400">Lens: 24-70mm f/2.8</p>
                                <p className="text-sm dark:text-gray-400">Dimensions: {photo.width} × {photo.height}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
