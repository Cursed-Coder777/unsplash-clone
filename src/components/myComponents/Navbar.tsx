'use client'

import Link from "next/link"
import { Focus, Search } from "lucide-react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const CATEGORIES = [
    "Featured", "Spring", "Wallpapers", "3D Renders", "Nature",
    "Textures", "Film", "Architecture", "Street Photography",
    "Experimental", "Travel", "People"
]

const Navbar = () => {
    const searchParams = useSearchParams() // ye hook URL ke search parameters ko access karne ke liye use hota hai
    const currentQ = searchParams.get('q') || ''
    const [searchTerm, setSearchTerm] = useState(currentQ)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/home?q=${encodeURIComponent(searchTerm.trim())}`)
        }
    }

    const handleCategoryClick = (category: string) => {
        const query = category.toLowerCase()
        setSearchTerm(category)
        router.push(`/home?q=${encodeURIComponent(query)}`)
    }

    return (
        <nav className="w-full bg-white border-b border-gray-200 fixed top-0 left-0 sm:ml-12 px-2 z-60 " >
            <div className="p-0 py-4 sm:p-4  ">
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="w-full ">
                        <div className="w-full flex bg-[#76767620] hover:bg-[#76767640] h-10 justify-center items-center p-4 rounded-full">
                            <button type="submit" className="flex items-center">
                                <Search size={18} className="text-gray-500" />
                            </button>
                            <div className="w-full h-10">
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search photos and illustrations"
                                    className="w-full h-full pl-1 outline-none border-none bg-transparent text-gray-700 [&::-webkit-search-cancel-button]:hidden"
                                />
                            </div>
                            <button type="button">
                                <Focus size={18} className="text-gray-500" />
                            </button>
                        </div>
                    </form>

                    <p className="w-30 hidden lg:block cursor-pointer text-[14px] text-black whitespace-nowrap hover:text-gray-600">
                        Get Unsplash+
                    </p>
                    <Link
                        href='/login'
                        className="text-[#767676]  hidden lg:block  hover:text-black text-[14px] whitespace-nowrap transition"
                    >
                        Login
                    </Link>
                    <button className="w-60  hidden lg:block  border border-[#767676] rounded-md p-1 cursor-pointer text-[#767676] hover:border-black hover:text-black text-[15px] whitespace-nowrap transition">
                        Submit an image
                    </button>
                </div>

                <div className="mt-5 mb-2 overflow-x-auto">
                    <ul className="flex gap-5 text-[15px] text-[#767676] min-w-max px-2">
                        {CATEGORIES.map((category) => (
                            <li
                                key={category}
                                className="hover:text-black cursor-pointer transition"
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
