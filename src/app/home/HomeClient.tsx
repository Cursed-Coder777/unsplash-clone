'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Bookmark, Plus, Download, Heart, Scroll, Share2, Wand2, Loader2 } from 'lucide-react'
import DownloadButton from '@/components/myComponents/DownloadButton'
import ScrollToTop from '@/components/myComponents/ScrollToTop'
import BookmarkButton from '@/components/myComponents/BookmarkButton'
import LikeButton from '@/components/myComponents/LikeButton'
import SponsoredPost from '@/components/myComponents/SponsoredPost'
import SearchFilters from '@/components/myComponents/SearchFilters'
import { PhotoSkeleton } from '@/components/myComponents/Skeleton'
import AddToCollectionModal from '@/components/myComponents/AddToCollectionModal'
import SharePhoto from '@/components/myComponents/SharePhoto'
import Tooltip from '@/components/myComponents/Tooltip'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/myComponents/Toast'

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
        profile_image: {
            small: string
            medium: string
            large: string
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
    const { data: session, status } = useSession();
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
        orientation: ''
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

            if (isNewSearch && isAiEnabled && q !== 'nature') {
                setIsAiExpanding(true);
                try {
                    const expandRes = await fetch('/api/ai/search/expand', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: q })
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

            let apiUrl = `/api/unsplash?query=${encodeURIComponent(searchQuery)}&page=${pageNum}&order_by=${filters.order_by}`
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
                setPhotos(prev => dedupePhotos(prev, apiPhotos))
            }
            setHasMore(pageNum < data.total_pages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        if (q !== initialQ || filters.order_by !== 'relevant' || filters.color || filters.orientation) {
            setPage(1)
            fetchPhotos(1, true)
        }
    }, [q, filters])

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

    const handleImageClick = (photoId: string) => {
        router.push(`/home/photo/${photoId}`, { scroll: false });
    };

    const columns = useMemo(() => {
        const cols: (UnsplashPhoto | { type: 'ad'; id: string })[][] = [[], [], []];
        const colHeights = [0, 0, 0];

        photos.forEach((photo, index) => {
            const minHeightIndex = colHeights.indexOf(Math.min(...colHeights));
            if (index > 0 && index % 12 === 0) {
                cols[minHeightIndex].push({ type: 'ad', id: `ad-${index}` });
                colHeights[minHeightIndex] += 1.25;
            }
            const targetCol = colHeights.indexOf(Math.min(...colHeights));
            cols[targetCol].push(photo);
            colHeights[targetCol] += (photo.height / photo.width);
        });
        return cols;
    }, [photos]);

    if (error) {
        return (
            <div className="container mx-auto p-10 text-center">
                <h2 className="text-xl text-red-500 mb-4">{error}</h2>
                <button onClick={() => fetchPhotos(1, true)} className="bg-black text-white px-6 py-2 rounded-lg">Try Again</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col container mx-auto px-4">
            <h1 className="text-2xl font-bold mt-4 mb-2 capitalize flex items-center gap-3">
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

            <SearchFilters
                onFilterChange={(newFilters) => setFilters(newFilters)}
            />

            {loading && photos.length === 0 ? (
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1"><PhotoSkeleton /></div>
                    <div className="hidden sm:block flex-1"><PhotoSkeleton /></div>
                    <div className="hidden lg:block flex-1"><PhotoSkeleton /></div>
                </div>
            ) : (
                <div className='flex flex-col lg:flex-row gap-4'>
                    {columns.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4">
                            {column.map((item, photoIndex) => {
                                if ('type' in item && item.type === 'ad') {
                                    return (
                                        <SponsoredPost
                                            key={item.id}
                                            title="Elevate Your Creative Vision"
                                            description="Get exclusive access to high-resolution photos."
                                            imageUrl="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400"
                                            sponsorName="CreativePro"
                                            targetUrl="https://unsplash.com"
                                        />
                                    );
                                }
                                const photo = item as UnsplashPhoto;
                                return (
                                    <div
                                        key={photo.id}
                                        className="relative group rounded-xl break-inside-avoid cursor-pointer overflow-hidden"
                                        onClick={() => handleImageClick(photo.id)}
                                    >
                                        <div
                                            className="group relative overflow-hidden break-inside-avoid cursor-pointer z-0"
                                            style={{ backgroundColor: photo.color || '#f3f3f3' }}
                                        >
                                            <Image
                                                src={photo.urls.small}
                                                width={photo.width}
                                                height={photo.height}
                                                alt={photo.alt_description || `High resolution photo by ${photo.user.name}`}
                                                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                priority={photoIndex < 4 && colIndex < 3}
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                                            <div className='absolute top-4 right-4 flex gap-2 z-10' onClick={(e) => e.stopPropagation()}>
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
                                            <div className='absolute bottom-4 right-4' onClick={(e) => e.stopPropagation()}>
                                                <Tooltip text="Download">
                                                    <DownloadButton photoId={photo.id} photoUrls={photo.urls} className='z-10' />
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
                        </div>
                    ))
                    }
                </div >
            )}

            <div ref={loadMoreRef} className="w-full py-10 flex justify-center">
                {loadingMore && <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>}
            </div>

            {
                photos.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No photos found for &quot;{q}&quot;</p>
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
            <ScrollToTop />
        </div >
    )
}

export default HomeClient;
