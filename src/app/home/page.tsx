'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowDown, Bookmark, Plus } from 'lucide-react'
import Image from 'next/image'


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

    const searchTerm = searchParams.get('q') || 'nature'

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    
    // ✅ Scroll position store karne ke liye
    const scrollPositionRef = useRef(0)

    const fetchPhotos = async (pageNum: number, isNewSearch: boolean = false) => {
        if (isNewSearch) {
            setLoading(true)
            setPhotos([])
            setPage(1)
            setHasMore(true)
        } else {
            setLoadingMore(true)
            // ✅ Current scroll position save karo
            scrollPositionRef.current = window.scrollY
        }

        try {
            // ⏳ 3 second artificial delay
            await new Promise(resolve => setTimeout(resolve, 3000))

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
                || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

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
                setPhotos(prev => [...prev, ...data.results])

                // ✅ Images load hone ke baad scroll position restore karo
                setTimeout(() => {
                    window.scrollTo({
                        top: scrollPositionRef.current,
                        behavior: 'auto' // 'smooth' mat karo, warna phir hilega
                    })
                }, 100)
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
        fetchPhotos(1, true)
    }, [searchTerm])

    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return
        const nextPage = page + 1
        setPage(nextPage)
        fetchPhotos(nextPage, false)
    }, [page, loadingMore, hasMore])

    useEffect(() => {
        if (loading) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMore()
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        )

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current)
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
        <div ref={containerRef} className="flex flex-col container mx-auto px-4">
            <h1 className="text-2xl font-bold my-4">
                {searchTerm === 'nature' ? 'Home' : ` ${searchTerm}`}
            </h1>

            <div className='columns-1 sm:columns-2 lg:columns-3 gap-4'>
                {photos?.map((photo, index) => (
                    <div key={`${photo.id}-${page}-${index}`} className="group relative overflow-hidden mb-4 break-inside-avoid">
                        <img
                            src={photo.urls.small}
                            alt={photo.alt_description || "Photo"}
                            className="w-full h-auto transition-transform duration-300 group-hover:scale-105 rounded-lg"
                            loading="lazy"
                        />

                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <div className='absolute top-5 right-5 flex gap-3'>
                                <button className='bg-white w-12 h-8 rounded-lg flex justify-center items-center text-[#767676] hover:text-black transition-colors'>
                                    <Bookmark size={17} />
                                </button>
                                <button className='bg-white w-12 h-8 rounded-lg flex justify-center items-center text-[#767676] hover:text-black transition-colors'>
                                    <Plus size={17} />
                                </button>
                            </div>

                            <div className='absolute bottom-5 right-5 z-10'>
                                <button className='bg-white w-12 h-8 rounded-lg flex justify-center items-center text-[#767676] hover:bg-red-600 hover:text-white transition-colors'>
                                    <ArrowDown size={20} />
                                </button>
                            </div>

                            <div className="absolute bottom-5 left-0 right-0 p-4 flex items-center gap-2">
                                <Image
                                    src={photo.user.profile_image.small}
                                    alt={photo.user.name}
                                    width={32}
                                    height={32}
                                    className='rounded-full w-8 h-8 object-cover'
                                />
                                <p className="text-white text-sm font-medium">
                                    {photo.user.name}
                                </p>
                            </div>
                        </div>
                    </div>
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