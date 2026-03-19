'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Bookmark, Plus, Download, Heart } from 'lucide-react'

interface UnsplashPhoto {
    id: string
    slug: string
    alternative_slugs: {
        en: string
        es: string
        ja: string
        fr: string
        it: string
        ko: string
        de: string
        pt: string
        id: string
    }
    created_at: string
    updated_at: string
    promoted_at: string | null
    width: number
    height: number
    color: string
    blur_hash: string
    description: string | null
    alt_description: string | null
    breadcrumbs: any[]
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
    current_user_collections: any[]
    sponsorship: null | any
    topic_submissions: {
        [key: string]: {
            status: string
            approved_on: string
        } | null
    }
    asset_type: string
    user: {
        id: string
        updated_at: string
        username: string
        name: string
        first_name: string
        last_name: string
        twitter_username: string | null
        portfolio_url: string | null
        bio: string | null
        location: string | null
        links: {
            self: string
            html: string
            photos: string
            likes: string
            portfolio: string
        }
        profile_image: {
            small: string
            medium: string
            large: string
        }
        instagram_username: string | null
        total_collections: number
        total_likes: number
        total_photos: number
        total_free_photos: number
        total_promoted_photos: number
        total_illustrations: number
        total_free_illustrations: number
        total_promoted_illustrations: number
        accepted_tos: boolean
        for_hire: boolean
        social: {
            instagram_username: string | null
            portfolio_url: string | null
            twitter_username: string | null
            paypal_email: string | null
        }
    }
}

const Home = () => {
    const searchParams = useSearchParams()
    const q = searchParams.get('q') || 'nature'

    const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const fetchPhotos = async (pageNum: number, isNewSearch: boolean = false) => {
        if (isNewSearch) {
            setLoading(true)
            setError('')
        } else {
            setLoadingMore(true)
        }

        try {
            const response = await fetch(
                `/api/unsplash?query=${encodeURIComponent(q)}&page=${pageNum}`,
                { cache: 'no-store' }
            )

            if (!response.ok) throw new Error('Failed to fetch photos')

            const data = await response.json()

            if (isNewSearch) {
                setPhotos(data.results || [])
            } else {
                setPhotos(prev => [...prev, ...(data.results || [])])
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
        setPage(1)
        fetchPhotos(1, true)
    }, [q])

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
    }, [loading, hasMore, loadingMore, page, q])

    if (error) {
        return (
            <div className="container mx-auto p-10 text-center">
                <h2 className="text-xl text-red-500 mb-4">{error}</h2>
                <button onClick={() => fetchPhotos(1, true)} className="bg-black text-white px-6 py-2 rounded-lg">Try Again</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col container mx-auto px-4 mt-30">
            <h1 className="text-2xl font-bold my-4 capitalize">
                {q}
            </h1>

            {loading && photos.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-gray-100 aspect-[3/4] animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
                    {photos.map((photo, index) => (
                        <div key={`${photo.id}-${index}`} className="group relative overflow-hidden mb-4 break-inside-avoid ">
                            <img
                                src={photo.urls.small}
                                alt={photo.alt_description || "Photo"}
                                className="w-full h-auto transition-transform duration-300"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity ">
                                <div className='absolute top-5 right-5 flex gap-3'>
                                    <button className='bg-white/80 backdrop-blur-sm w-10 h-8 rounded-lg flex justify-center items-center text-gray-700 hover:bg-white transition-colors'>
                                        <Bookmark size={16} />
                                    </button>
                                    <button className='bg-white/80 backdrop-blur-sm w-10 h-8 rounded-lg flex justify-center items-center text-gray-700 hover:bg-white transition-colors'>
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className='absolute bottom-5 right-5'>
                                    <button className='bg-white/80 backdrop-blur-sm w-10 h-8 rounded-lg flex justify-center items-center text-gray-700 hover:bg-white transition-colors'>
                                        <Download size={18} />
                                    </button>
                                </div>
                                <div className="absolute bottom-5 left-5 flex items-center gap-2">
                                    {photo.user.profile_image?.small && (
                                        <Image
                                            src={photo.user.profile_image.small}
                                            alt={photo.user.name}
                                            width={32}
                                            height={32}
                                            className='rounded-full w-8 h-8 object-cover border border-white/20'
                                        />
                                    )}
                                    <p className="text-white text-sm font-medium">
                                        {photo.user.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div ref={loadMoreRef} className="w-full py-10 flex justify-center">
                {loadingMore && (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                )}
            </div>

            {photos.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No photos found for &quot;{q}&quot;</p>
                </div>
            )}
        </div>
    )
}

export default Home