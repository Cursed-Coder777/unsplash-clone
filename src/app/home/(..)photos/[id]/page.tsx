import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { X, Download, Heart, Plus, Share2, Info } from 'lucide-react';

async function getPhoto(id: string) {
    const res = await fetch(
        `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
}

export default async function PhotoInterceptor({ params }: { params: { id: string } }) {
    const photo = await getPhoto(params.id);
    
    if (!photo) return notFound();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 md:p-10 overflow-y-auto">
            <Link href="/home" className="absolute inset-0 cursor-default" />

            <div className="bg-white rounded-lg max-w-6xl w-full min-h-[70vh] relative z-10 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 flex items-center justify-between sticky top-0 bg-white z-20 border-b">
                    <div className="flex items-center gap-3">
                        <Image
                            src={photo.user.profile_image.small}
                            alt={photo.user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <div>
                            <p className="font-bold text-sm">{photo.user.name}</p>
                            <p className="text-xs text-green-600">Available for hire</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/home"
                            className="text-gray-500 hover:text-black transition"
                        >
                            <X size={24} />
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 bg-white">
                    <Image
                        src={photo.urls.regular}
                        alt={photo.alt_description || 'Photo'}
                        width={photo.width}
                        height={photo.height}
                        className="max-h-[70vh] w-auto object-contain shadow-lg"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
