'use client'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ImageCard from '@/components/myComponents/ImageCard'

interface UnsplashPhoto {
    id: string
    urls: {
        small: string
        regular: string
    }
    alt_description: string | null
    user: {
        name: string
        profile_image: {
            small: string
        }
    }
    likes: number
}

const Home = () => {
    const searchParams = useSearchParams()
    const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const searchTerm = useMemo(() => searchParams.get('q') || 'nature', [searchParams])

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    const fetchPhotos = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
        if (isNewSearch) {
            setLoading(true)
            setPhotos([])
            setPage(1)
            setHasMore(true)
        } else {
            setLoadingMore(true)
        }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
                || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

            const response = await fetch(
                `${baseUrl}/api/unsplash?query=${searchTerm}&page=${pageNum}`,
                {
                    cache: 'no-store'
                }
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: { results: UnsplashPhoto[]; total_pages: number } = await response.json()

            if (isNewSearch) {
                setPhotos(data.results)
            } else {
                setPhotos(prev => {
                    // Filter out duplicates just in case
                    const existingIds = new Set(prev.map(p => p.id))
                    const newPhotos = data.results.filter(p => !existingIds.has(p.id))
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
    }, [searchTerm])

    useEffect(() => {
        fetchPhotos(1, true)
    }, [fetchPhotos])

    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return
        const nextPage = page + 1
        setPage(nextPage)
        fetchPhotos(nextPage, false)
    }, [page, loadingMore, hasMore, fetchPhotos])

    useEffect(() => {
        if (loading) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore()
                }
            },
            { threshold: 0.1, rootMargin: '400px' } // Increased margin for smoother loading
        )

        const currentRef = loadMoreRef.current
        if (currentRef) {
            observerRef.current.observe(currentRef)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [loading, hasMore, loadingMore, loadMore])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading photos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h2 className="text-2xl text-red-500 mb-4">Error: {error}</h2>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col container mx-auto px-4">
            <h1 className="text-2xl font-bold my-4 capitalize">
                {searchTerm === 'nature' ? 'Home' : searchTerm}
            </h1>

            <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
                {photos.map((photo) => (
                    <ImageCard key={photo.id} photo={photo} />
                ))}
            </div>

            {/* Load More Spinner */}
            <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
                {loadingMore && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">Loading more...</p>
                    </div>
                )}
                {!hasMore && photos.length > 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                        🎉 You've reached the end! No more photos to load.
                    </p>
                )}
            </div>

            {photos.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-10">
                    No photos found for &quot;{searchTerm}&quot;
                </p>
            )}
        </div>
    )
}

export default Home