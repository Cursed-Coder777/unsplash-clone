// src/app/collections/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Lock, Globe, FolderHeart, ArrowRight, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import AddToCollectionModal from '@/components/myComponents/AddToCollectionModal';

export default function CollectionsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            if (res.ok) {
                setCollections(data.collections);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchCollections();
        }
    }, [status, router]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={40} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black mb-2">My Collections</h1>
                    <p className="text-gray-500 font-medium">Organize and save your favorite photos</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                >
                    <Plus size={20} />
                    New Collection
                </button>
            </div>

            {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                        <FolderHeart className="text-gray-300" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No collections yet</h2>
                    <p className="text-gray-500 mb-8 max-w-sm">Create your first collection to start organizing photos you love.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        Create Collection
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {collections.map((collection) => (
                        <div
                            key={collection._id}
                            onClick={() => router.push(`/collections/${collection._id}`)}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-all">
                                {collection.coverPhoto ? (
                                    <Image
                                        src={collection.coverPhoto}
                                        alt={collection.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                        <FolderHeart size={48} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                    {collection.isPrivate ? <Lock size={10} /> : <Globe size={10} />}
                                    {collection.isPrivate ? 'Private' : 'Public'}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-gray-600 transition-colors">{collection.title}</h3>
                                    <p className="text-sm text-gray-400 font-medium">
                                        {collection.photos.length} {collection.photos.length === 1 ? 'photo' : 'photos'}
                                    </p>
                                </div>
                                <ArrowRight className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <AddToCollectionModal
                    isOpen={isModalOpen}
                    photo={null} // null means we are just creating/managing, not adding a specific photo
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchCollections(); // Refresh list after potential new collection
                    }}
                />
            )}
        </div>
    );
}
