'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Download, ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface DownloadItem {
    photoId: string;
    downloadedAt: string;
    photoData: {
        url: string;
        size: string;
    };
}

export default function DownloadsPage() {
    const { status } = useSession();
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const res = await fetch('/api/user/downloads');
                if (res.ok) {
                    const data = await res.json();
                    setDownloads(data);
                }
            } catch (error) {
                console.error('Fetch downloads error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchDownloads();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status]);

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Please login to view your downloads</h1>
                <Link href="/login" className="bg-black text-white px-6 py-2 rounded-lg">Login</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Download className="text-blue-500" /> Download History
            </h1>

            {downloads.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <ImageIcon className="mx-auto text-gray-300 mb-4" size={60} />
                    <p className="text-gray-500 text-lg">You haven&apos;t downloaded any photos yet.</p>
                    <Link href="/home" className="mt-4 inline-block text-blue-500 hover:underline">Explore photos</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {downloads.map((item, index) => (
                        <div key={`${item.photoId}-${index}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                            <div className="relative aspect-square bg-gray-100">
                                <Image
                                    src={item.photoData.url}
                                    alt={`Downloaded photo ${item.photoId}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <Link 
                                        href={`/home/photo/${item.photoId}`}
                                        className="p-2 bg-white rounded-full text-black hover:bg-gray-100"
                                        title="View Detail"
                                    >
                                        <ExternalLink size={20} />
                                    </Link>
                                    <a 
                                        href={item.photoData.url} 
                                        download 
                                        className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                                        title="Download Again"
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        Size: {item.photoData.size}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        {new Date(item.downloadedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                    Photo ID: {item.photoId}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
