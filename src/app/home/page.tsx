'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Masonry from 'react-masonry-css';
import { useSearchParams } from 'next/navigation';
import { GridSkeleton, ImageSkeleton } from '@/components/myComponents/Skeleton';

// Type for Unsplash photo
interface UnsplashPhoto {
    id: string;
    urls: {
        small: string;
        regular: string;
    };
    alt_description: string | null;
    user: {
        name: string;
    };
    likes: number;
}

export default function HomePage() {
    const searchParams = useSearchParams();
    const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());

    const currentSearch = searchParams.get('q') || 'nature';
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Masonry breakpoints
    const breakpointColumns = {
        default: 3,    // ✅ default 3 columns
        1100: 3,       // bade screen pe bhi 3
        900: 2,        // medium screen pe 2
        700: 2,        // tablet pe 2
        500: 1         // mobile pe 1

    };

    // Track image load
    const handleImageLoad = (photoId: string) => {
        setImagesLoaded(prev => new Set(prev).add(photoId));
    };

    // API call function
    const fetchPhotos = async (searchTerm: string, pageNum: number, isNewSearch: boolean = false) => {
        if (isNewSearch) {
            setLoading(true);
            setPhotos([]);
            setImagesLoaded(new Set());
            setPage(1);
        } else {
            setLoadingMore(true);
        }

        try {
            const res = await fetch(`/api/unsplash?query=${searchTerm}&page=${pageNum}`);

            if (!res.ok) {
                throw new Error('Failed to fetch photos');
            }

            const data = await res.json();

            if (isNewSearch) {
                setPhotos(data.results || []);
            } else {
                setPhotos(prev => [...prev, ...(data.results || [])]);
            }

            setTotalPages(data.total_pages || 0);
            setHasMore(pageNum < (data.total_pages || 0));

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial load or search change
    useEffect(() => {
        fetchPhotos(currentSearch, 1, true);
    }, [currentSearch]);

    // Load more function
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPhotos(currentSearch, nextPage, false);
    }, [currentSearch, page, loadingMore, hasMore]);

    // Intersection Observer setup
    useEffect(() => {
        if (loading) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loading, hasMore, loadingMore, loadMore]);

    return (
        <>
            {/* Search info */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Results for: &quot;{currentSearch}&quot;
                </h2>
                {totalPages > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                        Page {page} of {totalPages}
                    </p>
                )}
            </div>

            {/* Error state */}
            {error && !loading && (
                <div className="text-center text-red-500 py-20">
                    <p className="text-xl">Error: {error}</p>
                    <button
                        onClick={() => fetchPhotos(currentSearch, 1, true)}
                        className="mt-4 bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Photos grid */}
            {!error && (
                <>
                    <Masonry
                        breakpointCols={breakpointColumns}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {/* Show skeletons for loading images */}
                        {loading && !photos.length &&
                            Array(12).fill(0).map((_, index) => (
                                <div key={`skeleton-${index}`} className="mb-4">
                                    <ImageSkeleton />
                                </div>
                            ))
                        }

                        {/* Show actual photos */}
                        {photos.map((photo, index) => (
                            <div
                                key={`${photo.id}-${index}`}
                                className="relative group overflow-hidden cursor-zoom-in mb-4 "
                            >
                                {/* Skeleton while image loads */}
                                {!imagesLoaded.has(photo.id) && (
                                    <div className="absolute inset-0 z-10">
                                        <ImageSkeleton />
                                    </div>
                                )}

                                {/* Actual image */}
                                <Image
                                    src={photo.urls.small}
                                    alt={photo.alt_description || 'Photo'}
                                    width={500}
                                    height={500}
                                    className={`w-full h-auto transition-all duration-300 ${imagesLoaded.has(photo.id)
                                        ? 'opacity-100 scale-100'
                                        : 'opacity-0 scale-95'
                                        } group-hover:scale-105`}
                                    loading="lazy"
                                    onLoad={() => handleImageLoad(photo.id)}
                                />

                                {/* Hover overlay - show only when image loaded */}
                                {imagesLoaded.has(photo.id) && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <p className="text-white text-sm font-medium">
                                                📸 {photo.user.name}
                                            </p>
                                            {photo.likes > 0 && (
                                                <p className="text-white text-xs mt-1">
                                                    ❤️ {photo.likes} likes
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Masonry>

                    {/* Load more trigger */}
                    <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
                        {loadingMore && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <p className="text-sm text-gray-500">Loading more photos...</p>
                            </div>
                        )}
                        {!hasMore && photos.length > 0 && (
                            <p className="text-gray-500 text-sm py-4">
                                🎉 You&apos;ve reached the end! No more photos to load.
                            </p>
                        )}
                    </div>

                    {/* No photos found */}
                    {!loading && !error && photos.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No photos found for &quot;{currentSearch}&quot;</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}