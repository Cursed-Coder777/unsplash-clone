'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Bookmark, Plus, Download, Heart, Scroll, Share2, Wand2, Loader2 } from 'lucide-react'
import DownloadButton from '@/components/myComponents/DownloadButton'
import ScrollToTop from '@/components/myComponents/ScrollToTop'
import BookmarkButton from '@/components/myComponents/BookmarkButton'
import LikeButton from '@/components/myComponents/LikeButton'
import AdContainer from '@/components/myComponents/AdContainer'
import SearchFilters from '@/components/myComponents/SearchFilters'
import { PhotoSkeleton } from '@/components/myComponents/Skeleton'
import AddToCollectionModal from '@/components/myComponents/AddToCollectionModal'
import SharePhoto from '@/components/myComponents/SharePhoto'
import Tooltip from '@/components/myComponents/Tooltip'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/myComponents/Toast'
import Lightbox from '@/components/myComponents/Lightbox'
import Masonry from 'react-masonry-css'

export interface UnsplashPhoto {
    id: string
    slug: string
    alternative_slugs: any
    created_at: string
    updated_at: string
    promoted_at: string | null
    width: number
    height: number
    color: string
    blur_hash: string
    description: string | null
    alt_description: string | null
    urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
        small_s3: string
    }
    links: {
        self: string
        html: string
        download: string
        download_location: string
    }
    likes: number
    liked_by_user: boolean
    bookmarked: boolean
    user: {
        id: string
        username: string
        name: string
        location?: string
        profile_image: {
            small: string
            medium: string
            large: string
        }
    }
    exif?: {
        make: string | null
        model: string | null
        name: string | null
        exposure_time: string | null
        aperture: string | null
        focal_length: string | null
        iso: number | null
    }
    location?: {
        name: string | null
        city: string | null
        country: string | null
        position: {
            latitude: number | null
            longitude: number | null
        }
    }
}

interface HomeClientProps {
    initialPhotos: UnsplashPhoto[];
    q: string;
    aiSearch?: boolean;
}

const HomeClient = ({ initialPhotos, q: initialQ, aiSearch }: HomeClientProps) => {
    const searchParams = useSearchParams()
    const q = searchParams.get('q') || initialQ || 'nature'
    const { status } = useSession();
    const router = useRouter()
    const [photos, setPhotos] = useState<UnsplashPhoto[]>(initialPhotos)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [filters, setFilters] = useState({
        order_by: 'relevant',
        color: '',
        orientation: '',
        content_filter: 'high',
        camera: '',
        dateRange: ''
    })
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const dedupePhotos = (photosToKeep: UnsplashPhoto[], photosToAdd: UnsplashPhoto[]) => {
        const existingIds = new Set(photosToKeep.map(photo => photo.id))
        const filtered = photosToAdd.filter(photo => !existingIds.has(photo.id))
        return [...photosToKeep, ...filtered]
    }

    const [isAiExpanding, setIsAiExpanding] = useState(false);

    const fetchPhotos = async (pageNum: number, isNewSearch: boolean = false) => {
        if (isNewSearch) {
            setLoading(true)
            setError('')
        } else {
            setLoadingMore(true)
        }

        try {
            let searchQuery = q;
            const isAiEnabled = searchParams.get('ai') === 'true';

            // Handle Camera Filter (Append to query)
            if (filters.camera) {
                searchQuery += ` ${filters.camera}`;
            }

            // Handle Date Range (Unsplash Latest usually covers this, but we can add words)
            if (filters.dateRange === 'today') {
                searchQuery += ' today';
            }

            if (isNewSearch && isAiEnabled && q !== 'nature') {
                setIsAiExpanding(true);
                try {
                    const expandRes = await fetch('/api/ai/search/expand', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: searchQuery })
                    });
                    if (expandRes.ok) {
                        const expandData = await expandRes.json();
                        searchQuery = expandData.expandedQuery;
                    }
                } catch (e) {
                    console.error('AI expansion failed');
                } finally {
                    setIsAiExpanding(false);
                }
            }

            let apiUrl = `/api/unsplash?query=${encodeURIComponent(searchQuery)}&page=${pageNum}&order_by=${filters.order_by}&content_filter=${filters.content_filter}`
            if (filters.color) apiUrl += `&color=${filters.color}`
            if (filters.orientation) apiUrl += `&orientation=${filters.orientation}`

            const response = await fetch(apiUrl, { cache: 'no-store' })
            if (!response.ok) throw new Error('Failed to fetch photos')
            const data = await response.json()
            const apiPhotos: UnsplashPhoto[] = data.results || []

            if (isNewSearch) {
                const unique = Array.from(new Map(apiPhotos.map(photo => [photo.id, photo])).values())
                setPhotos(unique)
            } else {
                setPhotos(previousPhotos => dedupePhotos(previousPhotos, apiPhotos))
            }
            setHasMore(pageNum < data.total_pages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    // Save photo data for modal navigation (Performance optimization)
    useEffect(() => {
        if (photos.length > 0) {
            const ids = photos.map(p => p.id);
            sessionStorage.setItem('current_photo_ids', JSON.stringify(ids));

            // For instant modal loading, cache a few detailed fields of the current photos
            // We only store essential fields to keep sessionStorage under limit
            const cacheData = photos.reduce((acc, p) => {
                acc[p.id] = {
                    id: p.id,
                    urls: p.urls,
                    alt_description: p.alt_description,
                    description: p.description,
                    created_at: p.created_at,
                    user: p.user,
                    width: p.width,
                    height: p.height,
                    color: p.color
                };
                return acc;
            }, {} as Record<string, any>);
            sessionStorage.setItem('photo_cache', JSON.stringify(cacheData));
        }
    }, [photos]);

    const isFirstMount = useRef(true);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        setPage(1);
        fetchPhotos(1, true);
    }, [q, filters]);

    const loadMore = () => {
        if (loadingMore || !hasMore || loading) return
        const nextPage = page + 1
        setPage(nextPage)
        fetchPhotos(nextPage, false)
    }

    useEffect(() => {
        if (loading) return
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore()
                }
            },
            { threshold: 0.1, rootMargin: '400px' }
        )
        if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
        return () => observerRef.current?.disconnect()
    }, [loading, hasMore, loadingMore, page, q, filters])

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

    const handleImageClick = (photoId: string, index: number) => {
        // We now use intercepted routes
        router.push(`/photos/${photoId}`, { scroll: false });
    };

    // Close lightbox on URL change if it was opened via URL
    useEffect(() => {
        const photoId = searchParams.get('photo');
        if (photoId) {
            const index = photos.findIndex(p => p.id === photoId);
            if (index !== -1) {
                setCurrentLightboxIndex(index);
                setIsLightboxOpen(true);
            }
        }
    }, [searchParams, photos]);

    const items = useMemo(() => {
        const result: (UnsplashPhoto | { type: 'ad'; id: string })[] = [];
        photos.forEach((photo, index) => {
            // Insert ad every 8 items (better for grid)
            if (index > 0 && index % 8 === 0) {
                result.push({ type: 'ad', id: `ad-${index}` });
            }
            result.push(photo);
        });
        return result;
    }, [photos]);


    if (error) {
        return (
            <div className="container mx-auto p-10 text-center">
                <h2 className="text-xl text-red-500 mb-4 font-bold">{error}</h2>
                <button onClick={() => fetchPhotos(1, true)} className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-bold hover:opacity-80 transition-opacity">Try Again</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full">
            <div className="container px-4">
                <h1 className="text-2xl font-bold mt-4 mb-2 capitalize flex items-center gap-3 dark:text-white">
                    {q}
                    {searchParams.get('ai') === 'true' && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Wand2 size={10} /> AI Enhanced
                        </span>
                    )}
                </h1>

                {isAiExpanding && (
                    <div className="mb-4 flex items-center gap-3 text-purple-600 animate-pulse">
                        <Loader2 className="animate-spin" size={16} />
                        <span className="text-sm font-bold tracking-wide italic">AI is understanding your mood & expanding results...</span>
                    </div>
                )}
            </div>

            {/* Filter bar - Spans full width with solid background */}
            <div className="w-full border-b border-gray-100 dark:border-gray-800 sticky top-[108px] lg:top-[110px] bg-white dark:bg-[#111111] z-20 transition-all duration-300">
                <div className="max-w-full px-4 lg:px-6">
                    <SearchFilters
                        onFilterChange={(newFilters) => setFilters(newFilters)}
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                {loading && photos.length === 0 ? (
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1"><PhotoSkeleton /></div>
                        <div className="hidden sm:block flex-1"><PhotoSkeleton /></div>
                        <div className="hidden lg:block flex-1"><PhotoSkeleton /></div>
                    </div>
                ) : (
                    <Masonry
                        breakpointCols={{ default: 3, 1024: 2, 640: 1 }}
                        className="flex w-auto gap-4 lg:gap-6"
                        columnClassName="bg-clip-padding flex flex-col gap-4 lg:gap-6"
                    >
                        {items.map((item, photoIndex) => {
                            if ('type' in item && item.type === 'ad') {
                                return (
                                    <AdContainer
                                        key={item.id}
                                        adSlot="4544908958"
                                        adLayoutKey="-6n+ef+1v-2l-b"
                                        adFormat="fluid"
                                        className="w-full"
                                    />
                                );
                            }
                            const photo = item as UnsplashPhoto;
                            return (
                                <div
                                    key={photo.id}
                                    className="relative group rounded-xl break-inside-avoid cursor-pointer overflow-hidden"
                                    onClick={() => handleImageClick(photo.id, photos.indexOf(photo))}
                                    style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                                >
                                    <div
                                        className="absolute inset-0 bg-gray-200 dark:bg-gray-800 transition-opacity duration-300 pointer-events-none"
                                        style={{ backgroundColor: photo.color || '#f3f3f3' }}
                                    />
                                    <Image
                                        src={photo.urls.small}
                                        fill
                                        alt={photo.alt_description || `High resolution photo by ${photo.user.name}`}
                                        className="object-cover transition-all duration-700 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={photoIndex < 10}
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
                                        <div className='absolute top-4 right-4 flex gap-2' onClick={(e) => e.stopPropagation()}>
                                            <Tooltip text="Like" position='bottom'>
                                                <LikeButton photoId={photo.id} className='bg-white/90 backdrop-blur-sm shadow-sm' />
                                            </Tooltip>
                                            <Tooltip text="Bookmark" position='bottom'>
                                                <BookmarkButton photoId={photo.id} className='bg-white/90 backdrop-blur-sm shadow-sm' />
                                            </Tooltip>
                                            <Tooltip text="Add to Collection" position='bottom'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (status !== 'authenticated') {
                                                            toast.error('Please login to create or manage collections');
                                                            return;
                                                        }
                                                        setSelectedPhoto(photo);
                                                        setIsCollectionModalOpen(true);
                                                    }}
                                                    className='bg-white/90 backdrop-blur-sm w-[40px] h-[32px] flex items-center justify-center rounded-lg text-gray-700 hover:bg-white transition-all shadow-sm'
                                                    aria-label="Add photo to collection"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </Tooltip>
                                            <Tooltip text="Share" position='bottom'>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (status !== 'authenticated') {
                                                            toast.error('Please login to share photos');
                                                            return;
                                                        }
                                                        setSelectedPhoto({ id: photo.id, url: photo.urls.regular, title: photo.description || photo.alt_description });
                                                        setIsShareModalOpen(true);
                                                    }}
                                                    className='bg-white/90 backdrop-blur-sm w-[40px] h-[32px] flex items-center justify-center rounded-lg text-gray-700 hover:bg-white transition-all shadow-sm'
                                                    aria-label="Share photo"
                                                >
                                                    <Share2 size={16} />
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <div className='absolute bottom-4 right-4 z-[60]' onClick={(e) => e.stopPropagation()}>
                                            <Tooltip text="Download">
                                                <DownloadButton photoId={photo.id} photoUrls={photo.urls} className='z-[70]' />
                                            </Tooltip>
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                            {photo.user.profile_image?.small && (
                                                <Image src={photo.user.profile_image.small} alt={photo.user.name} width={32} height={32} className='rounded-full w-8 h-8 object-cover border-2 border-white/50' />
                                            )}
                                            <p className="text-white text-sm font-semibold drop-shadow-md">{photo.user.name}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Masonry>
                )}

                <div ref={loadMoreRef} className="w-full py-10">
                    {loadingMore && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            <PhotoSkeleton />
                            <div className="hidden md:block"><PhotoSkeleton /></div>
                            <div className="hidden xl:block"><PhotoSkeleton /></div>
                        </div>
                    )}
                </div>

                {
                    photos.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No photos found for &quot;{q}&quot;</p>
                        </div>
                    )
                }

                {
                    selectedPhoto && (
                        <>
                            <AddToCollectionModal isOpen={isCollectionModalOpen} onClose={() => setIsCollectionModalOpen(false)} photo={selectedPhoto} />
                            <SharePhoto isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} photo={selectedPhoto} />
                        </>
                    )
                }

                {/* Lightbox is now deprecated in favor of intercepted /photos route */}
                <ScrollToTop />
            </div>
        </div>
    )
}

export default HomeClient;
