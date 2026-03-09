import Image from 'next/image'
import { ArrowDown, Bookmark, Plus } from 'lucide-react'
import { memo } from 'react'

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

interface ImageCardProps {
    photo: UnsplashPhoto
}

const ImageCard = ({ photo }: ImageCardProps) => {
    return (
        <div className="group relative overflow-hidden mb-4 break-inside-avoid">
            <Image
                src={photo.urls.small}
                alt={photo.alt_description || "Photo"}
                width={500}
                height={500}
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
    )
}

export default memo(ImageCard)