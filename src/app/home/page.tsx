'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import ImageCard from '@/components/myComponents/ImageCard'

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

    const fetchPhotos = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
        if (isNewSearch) {
            setLoading(true)
            setError('')
        } else {
            setLoadingMore(true)
        }

        try {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
            const response = await fetch(
                `${baseUrl}/api/unsplash?query=${encodeURIComponent(q)}&page=${pageNum}`,
                { cache: 'no-store' }
            )

            if (!response.ok) throw new Error('Failed to fetch photos')

            const data: { results: UnsplashPhoto[]; total_pages: number } = await response.json()

            if (isNewSearch) {
                setPhotos(data.results || [])
            } else {
                setPhotos(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const newPhotos = (data.results || []).filter(p => !existingIds.has(p.id))
                    return [...prev, ...newPhotos]
                })
            }

            setHasMore(pageNum < data.total_pages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [q])

    // Pehli baar aur search term badalne par reset karo
    useEffect(() => {
        setPage(1)
        fetchPhotos(1, true)
    }, [q, fetchPhotos])

    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore || loading) return
        const nextPage = page + 1
        setPage(nextPage)
        fetchPhotos(nextPage, false)
    }, [page, loadingMore, hasMore, loading, fetchPhotos])

    // Infinite Scroll Observer
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

        const currentRef = loadMoreRef.current
        if (currentRef) observerRef.current.observe(currentRef)

        return () => observerRef.current?.disconnect()
    }, [loading, hasMore, loadingMore, loadMore])

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
            <h1 className="text-2xl font-bold my-4 capitalize">
                {q === 'nature' ? 'Editorial' : q}
            </h1>

            {loading && photos.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
                    {photos.map((photo) => (
                        <ImageCard key={photo.id} photo={photo} />
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