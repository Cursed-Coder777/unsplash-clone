import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download, Heart, Share2, Info, ArrowLeft } from 'lucide-react';

async function getPhoto(id: string) {
    const res = await fetch(
        `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
}

export default async function FullPhotoPage({ params }: { params: { id: string } }) {
    const photo = await getPhoto(params.id);

    if (!photo) return notFound();

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b h-16 flex items-center px-4 justify-between sticky top-0 bg-white z-10">
                <Link href="/home" className="flex items-center gap-2 hover:text-gray-600 transition">
                    <ArrowLeft size={20} />
                    <span>Back to Unsplash</span>
                </Link>
                <div className="flex gap-4">
                    <button className="border border-gray-300 px-4 py-1.5 rounded text-sm font-medium hover:border-black transition">
                        Share
                    </button>
                    <button className="bg-black text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-800 transition">
                        Download free
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Header info */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Image
                            src={photo.user.profile_image.medium}
                            alt={photo.user.name}
                            width={40}
                            height={40}
                            className="rounded-full shadow-sm"
                        />
                        <div>
                            <p className="font-bold">{photo.user.name}</p>
                            <p className="text-sm text-green-600 font-medium">Available for hire</p>
                        </div>
                    </div>
                </div>

                {/* Main image */}
                <div className="flex justify-center mb-8">
                    <Image
                        src={photo.urls.regular}
                        alt={photo.alt_description || 'Photo'}
                        width={photo.width}
                        height={photo.height}
                        className="max-h-[80vh] w-auto object-contain rounded shadow-lg"
                        priority
                    />
                </div>

                {/* Footer info/details */}
                <div className="grid md:grid-cols-2 gap-12 border-t pt-8">
                    <div className="space-y-4">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-gray-500 text-sm">Views</p>
                                <p className="font-medium text-sm">{(photo.views || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Downloads</p>
                                <p className="font-medium text-sm">{(photo.downloads || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Featured in</p>
                                <p className="font-medium text-sm">Editorial</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-gray-600 text-sm leading-relaxed">
                        <p>{photo.description || photo.alt_description}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
