'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { MapPin, Globe, Twitter, Instagram, Mail, CheckCircle2, MoreHorizontal } from 'lucide-react'
import { UnsplashPhoto } from '@/app/home/HomeClient'
import Link from 'next/link'
import DownloadButton from '@/components/myComponents/DownloadButton'
import BookmarkButton from '@/components/myComponents/BookmarkButton'
import LikeButton from '@/components/myComponents/LikeButton'
import Tooltip from '@/components/myComponents/Tooltip'
import { PhotoSkeleton } from '@/components/myComponents/Skeleton'
import Lightbox from '@/components/myComponents/Lightbox'
import Sidebar from '@/components/myComponents/Sidebar'
import Navbar from '@/components/myComponents/Navbar'
import AddToCollectionModal from '@/components/myComponents/AddToCollectionModal'
import SharePhoto from '@/components/myComponents/SharePhoto'
import { toast } from '@/components/myComponents/Toast'
import { useSession } from 'next-auth/react'
import Masonry from 'react-masonry-css'

interface ProfileClientProps {
    user: any;
    initialPhotos: UnsplashPhoto[];
}

export default function ProfileClient({ user, initialPhotos }: ProfileClientProps) {
    const [photos, setPhotos] = useState<UnsplashPhoto[]>(initialPhotos)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

    const { status } = useSession()
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null)

    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!loadMoreRef.current) return;

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loadingMore) {
                loadMore();
            }
        }, { threshold: 0.1 });

        observerRef.current.observe(loadMoreRef.current);
        return () => observerRef.current?.disconnect();
    }, [hasMore, loadingMore, page]);

    const loadMore = async () => {
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/unsplash/user/${user.username}/photos?page=${nextPage}`);
            const data = await res.json();

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setPhotos(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const filtered = data.filter((p: any) => !existingIds.has(p.id));
                    return [...prev, ...filtered];
                });
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Error loading more photos:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="flex bg-white dark:bg-black min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:pl-16">
                <Navbar />

                <main className="pt-24 pb-20">
                    {/* 👤 Profile Header */}
                    <header className="max-w-5xl mx-auto px-4 lg:px-6 mb-16">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl">
                                    <Image
                                        src={user.profile_image?.large}
                                        alt={user.name}
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {user.for_hire && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white dark:border-gray-900">
                                        <Tooltip text="Available for hire">
                                            <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                                        </Tooltip>
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <h1 className="text-3xl md:text-4xl font-bold dark:text-white leading-tight">
                                        {user.name}
                                    </h1>
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-black/80 dark:hover:bg-white/90 transition-all shadow-md">
                                            Follow
                                        </button>
                                        <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-black dark:hover:border-white transition-colors">
                                            <Mail size={18} className="text-gray-500" />
                                        </button>
                                        <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-black dark:hover:border-white transition-colors">
                                            <MoreHorizontal size={18} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-[15px] mb-6 max-w-2xl leading-relaxed">
                                    {user.bio || `Passionate about capturing moments and stories through lens. Follow along for more visual journeys.`}
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
                                    {user.location && (
                                        <span className="flex items-center gap-1.5"><MapPin size={16} /> {user.location}</span>
                                    )}
                                    {user.portfolio_url && (
                                        <a href={user.portfolio_url} target="_blank" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"><Globe size={16} /> Portfolio</a>
                                    )}
                                    {user.social?.twitter_username && (
                                        <a href={`https://twitter.com/${user.social.twitter_username}`} target="_blank" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"><Twitter size={16} /> Twitter</a>
                                    )}
                                    {user.social?.instagram_username && (
                                        <a href={`https://instagram.com/${user.social.instagram_username}`} target="_blank" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors"><Instagram size={16} /> Instagram</a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Counts Section */}
                        <div className="mt-12 flex items-center justify-center md:justify-start gap-12 border-t border-gray-100 dark:border-gray-800 pt-8">
                            <div className="text-center md:text-left">
                                <span className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">Total Photos</span>
                                <span className="text-xl font-bold dark:text-white">{user.total_photos.toLocaleString()}</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">Followers</span>
                                <span className="text-xl font-bold dark:text-white">{user.followers_count.toLocaleString()}</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">Following</span>
                                <span className="text-xl font-bold dark:text-white">{user.following_count.toLocaleString()}</span>
                            </div>
                        </div>
                    </header>

                    {/* 🖼️ User's Photos Grid */}
                    <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
                        <Masonry
                            breakpointCols={{ default: 3, 1024: 2, 640: 1 }}
                            className="flex w-auto gap-4 lg:gap-6"
                            columnClassName="bg-clip-padding flex flex-col gap-4 lg:gap-6"
                        >
                            {photos.map((photo, photoIndex) => (
                                <div
                                    key={photo.id}
                                    onClick={() => {
                                        const globalIndex = photos.findIndex(p => p.id === photo.id)
                                        setSelectedPhotoIndex(globalIndex)
                                    }}
                                    className="group relative cursor-zoom-in overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                                    style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                                >
                                    <div
                                        className="absolute inset-0 bg-gray-200 dark:bg-gray-800 transition-opacity duration-300 pointer-events-none"
                                        style={{ backgroundColor: photo.color || '#f3f3f3' }}
                                    />
                                    <Image
                                        src={photo.urls.small}
                                        alt={photo.alt_description || ""}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        priority={photoIndex < 6}
                                    />
                                    {/* Hover HUD */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="absolute top-4 right-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <LikeButton photoId={photo.id} className='bg-white/90 backdrop-blur-sm shadow-sm' />
                                            <BookmarkButton photoId={photo.id} className='bg-white/90 backdrop-blur-sm shadow-sm' />
                                        </div>
                                        <div className='absolute bottom-4 right-4' onClick={(e) => e.stopPropagation()}>
                                            <DownloadButton photoId={photo.id} photoUrls={photo.urls} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Masonry>

                        {/* Loading More State */}
                        <div ref={loadMoreRef} className="w-full py-10">
                            {loadingMore && (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                                    <PhotoSkeleton />
                                    <div className="hidden md:block"><PhotoSkeleton /></div>
                                    <div className="hidden xl:block"><PhotoSkeleton /></div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Lightbox for viewing photos */}
            {selectedPhotoIndex !== null && (
                <Lightbox
                    isOpen={true}
                    photos={photos}
                    initialIndex={selectedPhotoIndex}
                    onClose={() => setSelectedPhotoIndex(null)}
                    onShare={(photo) => {
                        if (status !== 'authenticated') {
                            toast.error('Please login to share photos');
                            return;
                        }
                        setSelectedPhoto({ id: photo.id, url: photo.urls?.regular || photo.url, title: photo.description || photo.alt_description });
                        setIsShareModalOpen(true);
                    }}
                    onAddToCollection={(photo) => {
                        if (status !== 'authenticated') {
                            toast.error('Please login to create or manage collections');
                            return;
                        }
                        setSelectedPhoto(photo);
                        setIsCollectionModalOpen(true);
                    }}
                />
            )}

            {/* Modals */}
            {selectedPhoto && (
                <>
                    <AddToCollectionModal
                        isOpen={isCollectionModalOpen}
                        onClose={() => setIsCollectionModalOpen(false)}
                        photo={selectedPhoto}
                    />
                    <SharePhoto
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                        photo={selectedPhoto}
                    />
                </>
            )}
        </div>
    )
}
