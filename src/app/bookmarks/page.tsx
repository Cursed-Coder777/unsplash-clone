'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Bookmark, Download, FolderPlus, Trash2, FolderHeart } from 'lucide-react';
import BookmarkButton from '@/components/myComponents/BookmarkButton';
import { toast } from '@/components/myComponents/Toast';

interface BookmarkItem {
    photoId: string;
    savedAt: string;
}

export default function BookmarksPage() {
    const { status } = useSession();
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [photoDetails, setPhotoDetails] = useState<Map<string, any>>(new Map());

    useEffect(() => {
        if (status === 'unauthenticated') {
            setLoading(false);
            return;
        }
        
        if (status === 'authenticated') {
            fetchBookmarks();
        }
    }, [status]);

    const fetchBookmarks = async () => {
        try {
            const res = await fetch('/api/user/bookmarks');
            const data = await res.json();
            setBookmarks(data.bookmarks);

            // Fetch photo details for each bookmark in parallel
            await Promise.all(
                data.bookmarks.map(async (bookmark: BookmarkItem) => {
                    try {
                        const photoRes = await fetch(`/api/unsplash/photo/${bookmark.photoId}`);
                        if (photoRes.ok) {
                            const photoData = await photoRes.json();
                            setPhotoDetails(prev => new Map(prev).set(bookmark.photoId, photoData));
                        }
                    } catch {
                        // silently skip failed photo fetches
                    }
                })
            );
        } catch {
            setError('Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (photoId: string) => {
        try {
            const res = await fetch(`/api/user/bookmarks/${photoId}`, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setBookmarks(prev => prev.filter(b => b.photoId !== photoId));
                setPhotoDetails(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(photoId);
                    return newMap;
                });
                toast.success('Removed from bookmarks');
            }
        } catch (err) {
            console.error('Remove bookmark error:', err);
            toast.error('Failed to remove bookmark');
        }
    };

    const clearAll = async () => {
        for (const b of uniqueBookmarks) {
            await removeBookmark(b.photoId);
        }
        toast.success('All bookmarks cleared');
    };

    const uniqueBookmarks = bookmarks.filter(
        (b, idx, arr) => arr.findIndex(x => x.photoId === b.photoId) === idx
    );

    // ✅ Show loading
    if (status === 'loading' || (loading && status === 'authenticated')) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
            </div>
        );
    }

    // ✅ Show login required message for unauthenticated users
    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <Bookmark size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Please login to view and manage your bookmarks
                </p>
                <button
                    onClick={() => router.push('/login')}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
                >
                    Login to Continue
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-10 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Bookmark size={22} className="text-black" fill="currentColor" />
                    <h1 className="text-3xl font-bold text-black">Bookmarks</h1>
                </div>

                {uniqueBookmarks.length > 0 && (
                    <div className="flex items-center gap-2">
                        <a
                            href="#"
                            className="flex items-center gap-1.5 bg-black text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            <Download size={15} />
                            Download all
                        </a>
                        <button className="flex items-center gap-1.5 border border-gray-300 text-sm font-medium px-4 py-2 rounded-md hover:border-black text-gray-700 hover:text-black transition-colors">
                            <FolderPlus size={15} />
                            Convert to collection
                        </button>
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1.5 border border-gray-300 text-sm font-medium px-4 py-2 rounded-md hover:border-red-400 text-gray-700 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={15} />
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Count */}
            {uniqueBookmarks.length > 0 && (
                <p className="text-sm text-gray-500 mb-6">
                    {uniqueBookmarks.length} {uniqueBookmarks.length === 1 ? 'image' : 'images'}
                </p>
            )}

            {/* Empty State */}
            {uniqueBookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <Bookmark size={48} className="text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-1">No bookmarks yet</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        When you bookmark a photo, it'll appear here.
                    </p>
                    <Link
                        href="/home"
                        className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Explore photos
                    </Link>
                </div>
            ) : (
                /* Masonry Grid — 3 columns like Unsplash */
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                    {uniqueBookmarks.map((bookmark) => {
                        const photo = photoDetails.get(bookmark.photoId);
                        return (
                            <div key={bookmark.photoId} className="break-inside-avoid mb-4 group relative">
                                <Link href={`/home/photo/${bookmark.photoId}`}>
                                    <img
                                        src={photo?.urls?.small || `https://picsum.photos/400/300?random=${bookmark.photoId}`}
                                        alt={photo?.alt_description || 'Bookmarked photo'}
                                        className="w-full h-auto rounded-lg"
                                        style={{ backgroundColor: photo?.color || '#f3f4f6' }}
                                    />
                                </Link>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }}>
                                    {/* Top-left icon */}
                                    <div className="absolute top-3 left-3">
                                        <BookmarkButton photoId={bookmark.photoId} size={16} />
                                    </div>

                                    {/* Top-right: remove */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeBookmark(bookmark.photoId); }}
                                        className="absolute top-3 right-3 bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors"
                                        title="Remove bookmark"
                                    >
                                        <Trash2 size={14} className="text-gray-600" />
                                    </button>

                                    {/* Bottom: user info */}
                                    {photo?.user && (
                                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
                                            {photo.user.profile_image?.small && (
                                                <Image
                                                    src={photo.user.profile_image.small}
                                                    alt={photo.user.name}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full border border-white/40"
                                                />
                                            )}
                                            <span className="text-white text-sm font-medium truncate drop-shadow">
                                                {photo.user.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}