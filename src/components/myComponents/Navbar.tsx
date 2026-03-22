// src/components/myComponents/Navbar.tsx
'use client'

import Link from "next/link"
import { Focus, Search, Menu, X, Plus, Info, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const CATEGORIES = [
    "Featured", "Spring", "Wallpapers", "3D Renders", "Nature",
    "Textures", "Film", "Architecture", "Street Photography",
    "Experimental", "Travel", "People"
]

const Navbar = () => {
    const searchParams = useSearchParams()
    const currentQ = searchParams.get('q') || ''
    const [searchTerm, setSearchTerm] = useState(currentQ)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    // Disable body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

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
        <nav className="w-full bg-white border-b border-gray-200 fixed top-0 left-0  z-40 transition-all duration-300 lg:pl-16" >
            <div className="p-4">
                <div className="flex items-center gap-4">
                    {/* Logo for mobile */}
                    <div className="lg:hidden">
                        <Link href="/home">
                            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" fill="currentColor"></path>
                            </svg>
                        </Link>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="w-full flex bg-gray-100 hover:bg-gray-200 h-9 lg:h-10 items-center px-4 rounded-full transition-colors group">
                            <button type="submit" className="flex items-center">
                                <Search size={18} className="text-gray-500 group-focus-within:text-black" />
                            </button>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search photos"
                                className="w-full h-full pl-2 outline-none border-none bg-transparent text-sm lg:text-base text-gray-800 [&::-webkit-search-cancel-button]:hidden"
                            />
                            <button type="button" className="hidden sm:block">
                                <Focus size={18} className="text-gray-500 hover:text-black" />
                            </button>
                        </div>
                    </form>

                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="/plus" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            Get Unsplash+
                        </Link>
                        <button className="text-sm font-medium text-gray-500 border border-gray-300 px-3 py-1.5 rounded-md hover:border-black hover:text-black transition-all">
                            Submit an image
                        </button>
                    </div>

                    {/* Mobile Menu Icon */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-black p-1"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Drawer Overlay */}
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                {/* Mobile Drawer Content */}
                <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Drawer Header */}
                        <div className="p-4 flex justify-between items-center border-b border-gray-100">
                            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" fill="currentColor"></path>
                            </svg>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto py-6">
                            <div className="px-6 space-y-8">
                                <div className="space-y-4">
                                    <Link href="/plus" className="flex items-center gap-4 text-[15px] font-medium text-gray-900 group" onClick={() => setIsMenuOpen(false)}>
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                                            <Plus size={18} />
                                        </div>
                                        <span>Unsplash+</span>
                                    </Link>
                                    <button className="w-full flex items-center gap-4 text-[15px] font-medium text-gray-900 group" onClick={() => setIsMenuOpen(false)}>
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                                            <Plus size={18} />
                                        </div>
                                        <span>Submit an image</span>
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 pt-8 space-y-6">
                                    <Link href="/about" className="flex items-center gap-4 text-[15px] text-gray-600 hover:text-black transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        <Info size={18} />
                                        <span>About</span>
                                    </Link>
                                    <div className="flex items-center gap-4 text-[15px] text-gray-600 cursor-pointer hover:text-black transition-colors">
                                        <Globe size={18} />
                                        <span>Language: English</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                            <Link
                                href="/login"
                                className="block w-full text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-3"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Join Free
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto no-scrollbar">
                    <ul className="flex gap-4 lg:gap-6 text-sm font-medium text-gray-500 min-w-max pb-1">
                        {CATEGORIES.map((category) => (
                            <li
                                key={category}
                                className={`cursor-pointer transition-colors hover:text-black ${searchTerm.toLowerCase() === category.toLowerCase() ? 'text-black border-b-2 border-black pb-2 -mb-2' : ''}`}
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
