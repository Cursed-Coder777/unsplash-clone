import Link from 'next/link'
import Image from 'next/image'
import { X, Heart, Plus, Download } from 'lucide-react'

// Mock fetching logic
async function getPhoto(id: string) {
    const res = await fetch(`https://api.unsplash.com/photos/${id}`, {
        headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        },
        next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (!res.ok) return null
    return res.json()
}

export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params // Await params in Server Components
    const photo = await getPhoto(id)

    if (!photo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500">Photo not found</p>
                <Link href="/home" className="mt-4 text-blue-500 hover:underline">Return Home</Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-10">
            <Link href="/home" className="inline-flex items-center mb-6 text-gray-600 hover:text-black transition group">
                <div className="p-2 rounded-full group-hover:bg-gray-100 mr-2">
                    <X size={24} />
                </div>
                <span className="font-medium">Back to gallery</span>
            </Link>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {photo.user?.profile_image?.small && (
                            <Image 
                                src={photo.user.profile_image.small} 
                                alt={photo.user.name} 
                                width={40} height={40} 
                                className="rounded-full shadow-inner"
                            />
                        )}
                        <div>
                            <p className="font-bold text-gray-900">{photo.user.name}</p>
                            <p className="text-xs text-green-600 font-medium">Available for hire</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="border border-gray-200 p-2.5 rounded-lg hover:bg-gray-50 transition shadow-sm"><Heart size={20} className="text-gray-600"/></button>
                        <button className="border border-gray-200 p-2.5 rounded-lg hover:bg-gray-50 transition shadow-sm"><Plus size={20} className="text-gray-600"/></button>
                        <button className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md font-medium">
                            Download free
                        </button>
                    </div>
                </div>

                <div className="relative w-full flex justify-center bg-[#f5f5f5] p-4 md:p-10 min-h-[60vh]">
                    <img 
                        src={photo.urls.regular} 
                        alt={photo.alt_description} 
                        className="max-h-[80vh] w-auto object-contain shadow-2xl rounded"
                    />
                </div>

                <div className="p-8 max-w-4xl">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">{photo.alt_description || "Untitled Photo"}</h1>
                    <div className="grid grid-cols-3 gap-10">
                        <div>
                            <p className="uppercase text-[11px] font-bold text-gray-400 tracking-wider mb-1">Views</p>
                            <p className="text-lg font-bold text-gray-800">{photo.views?.toLocaleString() || '-'}</p>
                        </div>
                        <div>
                            <p className="uppercase text-[11px] font-bold text-gray-400 tracking-wider mb-1">Downloads</p>
                            <p className="text-lg font-bold text-gray-800">{photo.downloads?.toLocaleString() || '-'}</p>
                        </div>
                        <div>
                            <p className="uppercase text-[11px] font-bold text-gray-400 tracking-wider mb-1">Featured in</p>
                            <p className="text-lg font-bold text-gray-800">Editorial</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
