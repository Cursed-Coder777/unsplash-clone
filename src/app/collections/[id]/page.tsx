// src/app/collections/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Globe, ArrowLeft, Loader2, Share2, MoreHorizontal } from 'lucide-react';
import { PhotoSkeleton } from '@/components/myComponents/Skeleton';
import LikeButton from '@/components/myComponents/LikeButton';
import BookmarkButton from '@/components/myComponents/BookmarkButton';
import DownloadButton from '@/components/myComponents/DownloadButton';

export default function CollectionPage() {
    const params = useParams();
    const router = useRouter();
    const [collection, setCollection] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const res = await fetch(`/api/collections/${params.id}`);
                const data = await res.json();
                
                if (res.ok) {
                    setCollection(data.collection);
                } else {
                    setError(data.error || 'Failed to load collection');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchCollection();
    }, [params.id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse mb-8 max-w-2xl">
                    <div className="h-10 bg-gray-100 w-1/2 rounded-lg mb-4"></div>
                    <div className="flex gap-4">
                        <div className="h-6 bg-gray-100 w-24 rounded"></div>
                        <div className="h-6 bg-gray-100 w-32 rounded"></div>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1"><PhotoSkeleton /></div>
                    <div className="hidden sm:block flex-1"><PhotoSkeleton /></div>
                    <div className="hidden lg:block flex-1"><PhotoSkeleton /></div>
                </div>
            </div>
        );
    }

    if (error || !collection) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                <p className="text-gray-500 mb-6">{error || 'Collection not found'}</p>
                <button 
                    onClick={() => router.push('/home')}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>
        );
    }

    // Distribute photos into 3 columns
    const columns: any[][] = [[], [], []];
    const colHeights = [0, 0, 0];
    
    collection.photos.forEach((photoObj: any) => {
        const photo = photoObj.photoData;
        if (!photo) return;
        
        const targetCol = colHeights.indexOf(Math.min(...colHeights));
        columns[targetCol].push(photo);
        // Estimate height based on typical aspect ratio
        colHeights[targetCol] += (photo.height / photo.width);
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-1 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black mb-4">{collection.title}</h1>
                
                {collection.description && (
                    <p className="text-xl text-gray-600 mb-6 max-w-3xl">{collection.description}</p>
                )}
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {collection.user?.avatar ? (
                                <Image 
                                    src={collection.user.avatar} 
                                    alt={collection.user.name || 'User'} 
                                    width={32} height={32} 
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs uppercase">
                                    {(collection.user?.firstName?.[0] || 'U')}
                                </div>
                            )}
                            <span className="font-semibold">{collection.user?.firstName} {collection.user?.lastName}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="text-gray-500 font-medium">
                            {collection.photos.length} photos
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="flex items-center gap-1 text-gray-500 font-medium">
                            {collection.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                            {collection.isPrivate ? 'Private' : 'Public'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Grid */}
            {collection.photos.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <h3 className="text-xl font-bold mb-2">No photos yet</h3>
                    <p className="text-gray-500">Add photos to this collection to see them here.</p>
                </div>
            ) : (
                <div className='flex flex-col md:flex-row gap-4'>
                    {columns.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 flex flex-col gap-4">
                            {column.map((photo) => (
                                <div key={photo.id} className="relative group rounded-xl break-inside-avoid cursor-pointer overflow-hidden pb-4">
                                    <div 
                                        className="group relative overflow-hidden break-inside-avoid cursor-pointer rounded-xl bg-gray-100"
                                        onClick={() => router.push(`/home/photo/${photo.id}`, { scroll: false })}
                                    >
                                        <Image
                                            src={photo.urls?.small || photo.urls?.regular}
                                            width={photo.width}
                                            height={photo.height}
                                            alt={photo.alt_description || "Photo"}
                                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="hidden group-hover:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
