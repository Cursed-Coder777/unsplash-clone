// app/photo/[id]/page.tsx
import { ArrowDown, Bookmark, ChevronDown, Plus, Scissors } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RiCheckLine } from 'react-icons/ri'
interface Props {
    params: Promise<{
        id: string
    }>
}
interface UnsplashPhoto {
    id: string
    slug: string
    alternative_slugs: {
        en: string
        es: string
        ja: string
        fr: string
        it: string
        ko: string
        de: string
        pt: string
        id: string
    }
    created_at: string
    updated_at: string
    promoted_at: string | null
    width: number
    height: number
    color: string
    blur_hash: string
    description: string | null
    alt_description: string | null
    breadcrumbs: any[]
    urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
        small_s3: string
    }
    links: {
        self: string
        html: string
        download: string
        download_location: string
    }
    likes: number
    liked_by_user: boolean
    bookmarked: boolean
    current_user_collections: any[]
    sponsorship: null | any
    topic_submissions: {
        [key: string]: {
            status: string
            approved_on: string
        } | null
    }
    asset_type: string
    user: {
        id: string
        updated_at: string
        username: string
        name: string
        first_name: string
        last_name: string
        twitter_username: string | null
        portfolio_url: string | null
        bio: string | null
        location: string | null
        links: {
            self: string
            html: string
            photos: string
            likes: string
            portfolio: string
        }
        profile_image: {
            small: string
            medium: string
            large: string
        }
        instagram_username: string | null
        total_collections: number
        total_likes: number
        total_photos: number
        total_free_photos: number
        total_promoted_photos: number
        total_illustrations: number
        total_free_illustrations: number
        total_promoted_illustrations: number
        accepted_tos: boolean
        for_hire: boolean
        social: {
            instagram_username: string | null
            portfolio_url: string | null
            twitter_username: string | null
            paypal_email: string | null
        }
    }
}
async function getPhoto(id: string) {
    const res = await fetch(
        `https://api.unsplash.com/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    )

    if (!res.ok) return null
    return res.json()
}

export default async function PhotoPage({ params }: Props) {
    const { id } = await params
    const photo: UnsplashPhoto | null = await getPhoto(id)

    if (!photo) return notFound()

    return (
        <div className="">
            <div className='flex items-center justify-between mb-4'>
                <div className=' flex items-center justify-between gap-2 mb-4'>
                    <Image src={photo.user.profile_image.small} alt={photo.user.name} width={34} height={34} className='rounded-full' />
                    <div className='flex flex-col '>
                        <h1 className='font-medium text-[15px]'>{photo.user.name}</h1>
                        {photo.user.for_hire && (
                            <h2 className='text-[12px] text-blue-500 -mt-1 flex items-center gap-1'>Available for hire
                                <span className='bg-blue-500 text-white rounded-full' ><RiCheckLine size={11} /></span></h2>
                        )}
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <button className=' border border-gray-400 px-3 py-1 rounded-md cursor-pointer transition-colors'>
                        <Bookmark size={20} />
                    </button>
                    <button className=' border border-gray-400 px-3 py-1 rounded-md cursor-pointer transition-colors'>
                        <Plus size={20} />
                    </button>
                  

                   <div className='flex'>
                     <button className='border border-gray-400 px-3 py-0.5 rounded-bl-md rounded-tl-md  transition-colors'>
                       <Link href={photo.links.download} target='_blank' rel='noopener noreferrer'>
                        Downlod
                       </Link>
                    </button>
                    <button className=' border border-gray-400 px-3 py-1 rounded-br-md rounded-tr-md  cursor-pointer transition-colors'>
                        <ChevronDown size={20} />
                    </button>
                   </div>
                </div>
            </div>
            <div className='w-full flex items-center justify-center'>
                <Image
                    src={photo.urls.regular}
                    alt={photo.alt_description || 'Photo'}
                    width={photo.width / 7}
                    height={photo.height / 7}
                    className="rounded-lg min-w-185  "
                />
            </div>

           
        </div>
    )
}