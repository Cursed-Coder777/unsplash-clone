// src/components/myComponents/AddToCollectionModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Lock, Globe, Check, Loader2, FolderPlus } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/components/myComponents/Toast';

interface Collection {
    _id: string;
    title: string;
    isPrivate: boolean;
    photos: Array<{ photoId: string }>;
    coverPhoto?: string;
}

interface AddToCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    photo?: {
        id: string;
        urls: { small: string, regular?: string };
        user: { name: string };
    } | null;
}

export default function AddToCollectionModal({ isOpen, onClose, photo }: AddToCollectionModalProps) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newIsPrivate, setNewIsPrivate] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            if (res.ok) {
                setCollections(data.collections);
            }
        } catch (error) {
            console.error('Fetch collections error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCollections();
        }
    }, [isOpen]);

    const handleTogglePhoto = async (collectionId: string, inCollection: boolean) => {
        if (processingId) return;
        setProcessingId(collectionId);

        try {
            if (!photo) return;
            
            const body = inCollection 
                ? { photoToRemove: photo.id }
                : { photoToAdd: photo };

            const res = await fetch(`/api/collections/${collectionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchCollections();
                toast.success(inCollection ? 'Removed from collection' : 'Added to collection');
            } else {
                toast.error('Failed to update collection');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setProcessingId(null);
        }
    };

    const handleCreateCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: newTitle, 
                    isPrivate: newIsPrivate 
                })
            });

            if (res.ok) {
                const data = await res.json();
                // Automatically add photo to new collection if photo exists
                if (photo) {
                    await handleTogglePhoto(data.collection._id, false);
                }
                setIsCreating(false);
                setNewTitle('');
                setNewIsPrivate(false);
                fetchCollections();
            } else {
                toast.error('Failed to create collection');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] sm:max-h-[600px] animate-in slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left Side: Photo Preview / Info */}
                <div className="hidden md:block w-2/5 relative bg-gray-50 border-r border-gray-100 h-full min-h-[400px]">
                    {photo ? (
                        <>
                            <Image 
                                src={photo.urls.regular || photo.urls.small}
                                alt="Photo to add"
                                layout="fill"
                                objectFit="cover"
                                className="opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                                <p className="text-white text-sm font-medium">Add to collection</p>
                                <h2 className="text-white text-2xl font-bold mt-1">Organize your workspace</h2>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                                <Plus size={40} className="text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Create Collection</h2>
                            <p className="text-gray-500 mt-2">Bring order to your inspiration</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Collections List */}
                <div className="flex-1 flex flex-col bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">
                            {photo ? 'Add to collection' : 'Collections'}
                        </h3>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {isCreating ? (
                            <form onSubmit={handleCreateCollection} className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Name</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Dream Destinations"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-0 focus:ring-2 focus:ring-black rounded-xl transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Description (Optional)</label>
                                    <textarea 
                                        placeholder="Add a few words about this collection..."
                                        className="w-full px-4 py-3 bg-gray-50 border-0 focus:ring-2 focus:ring-black rounded-xl transition-all h-24 resize-none"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500">
                                            {newIsPrivate ? <Lock size={18} /> : <Globe size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{newIsPrivate ? 'Private' : 'Public'}</p>
                                            <p className="text-xs text-gray-500">{newIsPrivate ? 'Only you can see this' : 'Everyone can see this'}</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setNewIsPrivate(!newIsPrivate)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${newIsPrivate ? 'bg-black' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newIsPrivate ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={loading || !newTitle.trim()}
                                        className="flex-1 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create Collection'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <button 
                                    onClick={() => setIsCreating(true)}
                                    className="w-full p-4 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-3 text-gray-500 hover:border-black hover:text-black transition-all group"
                                >
                                    <FolderPlus size={20} className="group-hover:scale-110 transition-transform" />
                                    <span className="font-bold">Create a new collection</span>
                                </button>

                                {loading ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                                        <Loader2 className="animate-spin" size={32} />
                                        <p className="text-sm font-medium">Loading your collections...</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {collections.map((coll) => {
                                            const inCollection = !!(photo && coll.photos.some(p => p.photoId === photo.id));
                                            return (
                                                <button
                                                    key={coll._id}
                                                    onClick={() => photo && handleTogglePhoto(coll._id, inCollection)}
                                                    className={`flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100 ${!photo && 'cursor-default'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden relative">
                                                            {coll.coverPhoto ? (
                                                                <Image src={coll.coverPhoto} alt="" fill className="object-cover" />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-gray-300">
                                                                    <Plus size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-bold text-gray-900 group-hover:text-black transition-colors">{coll.title}</p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                {coll.isPrivate ? <Lock size={10} /> : <Globe size={10} />}
                                                                {coll.photos.length} photos
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {photo && (
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${inCollection ? 'bg-black border-black text-white' : 'border-gray-100 text-transparent group-hover:text-gray-300'}`}>
                                                            {processingId === coll._id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <Check size={20} />
                                                            )}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                        {collections.length === 0 && !loading && !isCreating && (
                                            <div className="text-center py-10">
                                                <p className="text-gray-400 text-sm">No collections yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
