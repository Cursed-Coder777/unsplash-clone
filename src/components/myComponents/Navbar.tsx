// src/components/myComponents/Navbar.tsx
'use client'

import Link from "next/link"
import { Focus, Search, Menu, X, Plus, Info, Globe, Wand2, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation"
import UserMenu from "./UserMenu";
import { useSession } from "next-auth/react";
import Tooltip from "./Tooltip";
import Image from "next/image";


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
    const { data: session, status } = useSession()
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])


    // Disable body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    const [isAiEnabled, setIsAiEnabled] = useState(searchParams.get('ai') === 'true')

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            let url = `/home?q=${encodeURIComponent(searchTerm.trim())}`
            if (isAiEnabled) {
                url += `&ai=true`
            }
            router.push(url)
        }
    }

    const handleCategoryClick = (category: string) => {
        const query = category.toLowerCase()
        setSearchTerm(category)
        router.push(`/home?q=${encodeURIComponent(query)}`)
    }

    return (
        <nav className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 z-40 transition-all duration-300 lg:pl-16 shadow-sm" >
            <div className="p-4">
                <div className="flex items-center gap-4">
                    {/* Logo for mobile */}
                    <div className="lg:hidden">
                        <Link href="/home" className="dark:text-white">
                            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" fill="currentColor"></path>
                            </svg>
                        </Link>
                    </div>

                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="w-full flex bg-gray-100 dark:bg-gray-900 border border-transparent dark:hover:border-gray-700 h-9 lg:h-10 items-center px-4 rounded-full transition-all group">
                            <button type="submit" className="flex items-center">
                                <Search size={18} className="text-gray-500 dark:text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white" />
                            </button>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search photos"
                                className="w-full h-full pl-2 outline-none border-none bg-transparent text-sm lg:text-base text-gray-800 dark:text-gray-200 [&::-webkit-search-cancel-button]:hidden"
                            />

                            {/* AI Mode Toggle */}
                            <button
                                type="button"
                                onClick={() => setIsAiEnabled(!isAiEnabled)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${isAiEnabled ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/20' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                                title={isAiEnabled ? 'AI Enhanced Search ON' : 'Turn on AI Enhanced Search'}
                            >
                                <Wand2 size={16} className={isAiEnabled ? 'animate-pulse' : ''} />
                                <span className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${isAiEnabled ? 'block' : 'opacity-50'}`}>AI</span>
                            </button>

                            <button type="button" className="hidden sm:block ml-2 border-l border-gray-200 dark:border-gray-800 pl-2">
                                <Focus size={18} className="text-gray-500 hover:text-black dark:hover:text-white cursor-help" />
                            </button>
                        </div>
                    </form>

                    <div className="hidden lg:flex items-center gap-4">
                        <Tooltip text="Get Unsplash+" position="bottom">
                            <Link href="/plus" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                Unsplash+
                            </Link>
                        </Tooltip>
                        <Tooltip text="Submit an image" position="bottom">
                            <button className="text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 px-3 py-1.5 rounded-md hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all whitespace-nowrap">
                                Submit an image
                            </button>
                        </Tooltip>

                        <div className="w-10 h-10 flex items-center justify-center">
                            {mounted ? (
                                <button 
                                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                                    title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                                >
                                    {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                            ) : (
                                <div className="w-10 h-10" />
                            )}
                        </div>

                        <div className="flex items-center gap-4 ml-1 border-l border-gray-200 dark:border-gray-800 pl-4 h-8">
                            <UserMenu variant="navbar" />
                        </div>
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
                <div className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-black z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Drawer Header */}
                        <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                            <svg className="w-8 h-8 dark:text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" fill="currentColor"></path>
                            </svg>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X size={24} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto py-6">
                            <div className="px-6 space-y-8">
                                <div className="space-y-4">
                                    <Link href="/home/generate" className="flex items-center gap-4 text-[15px] font-medium text-gray-900 dark:text-gray-100 group" onClick={() => setIsMenuOpen(false)}>
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                                            <Wand2 size={18} />
                                        </div>
                                        <span>Generate Image</span>
                                    </Link>
                                    <Link href="/plus" className="flex items-center gap-4 text-[15px] font-medium text-gray-900 dark:text-gray-100 group" onClick={() => setIsMenuOpen(false)}>
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                                            <Plus size={18} />
                                        </div>
                                        <span>Unsplash+</span>
                                    </Link>
                                    <button className="w-full flex items-center gap-4 text-[15px] font-medium text-gray-900 dark:text-gray-100 group" onClick={() => setIsMenuOpen(false)}>
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                                            <Plus size={18} />
                                        </div>
                                        <span>Submit an image</span>
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 space-y-6">
                                    <Link href="/about" className="flex items-center gap-4 text-[15px] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        <Info size={18} />
                                        <span>About</span>
                                    </Link>
                                    <div className="flex items-center gap-4 text-[15px] text-gray-600 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                                        <Globe size={18} />
                                        <span>Language: English</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 mt-auto">
                            <UserMenu variant="drawer" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto no-scrollbar">
                    <ul className="flex gap-4 lg:gap-6 text-sm font-medium text-gray-500 dark:text-gray-400 min-w-max pb-1">
                        {CATEGORIES.map((category) => (
                            <li
                                key={category}
                                className={`cursor-pointer transition-colors hover:text-black dark:hover:text-white ${searchTerm.toLowerCase() === category.toLowerCase() ? 'text-black dark:text-white border-b-2 border-black dark:border-white pb-2 -mb-2' : ''}`}
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
