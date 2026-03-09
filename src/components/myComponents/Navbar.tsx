'use client'
import Link from "next/link"
import { Focus, Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/home?q=${encodeURIComponent(searchTerm)}`)
        }
    }

    return (
        <nav className="w-full bg-white border-b border-gray-200 fixed top-0 right-0 z-40" style={{ width: 'calc(100% - 3%)' }}>
            <div className="p-4">
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="w-full">
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

                    <p className="w-[7%] cursor-pointer text-[14px] text-black whitespace-nowrap hover:text-gray-600">
                        Get Unsplash+
                    </p>
                    <Link
                        href='/login'
                        className="text-[#767676] hover:text-black text-[14px] whitespace-nowrap transition"
                    >
                        Login
                    </Link>
                    <button className="w-[10%] border border-[#767676] rounded-md p-1 cursor-pointer text-[#767676] hover:border-black hover:text-black text-[15px] whitespace-nowrap transition">
                        Submit an image
                    </button>
                </div>

                <div className="mt-5 mb-2 overflow-x-auto">
                    <ul className="flex gap-5 text-[15px] text-[#767676] min-w-max">
                        <li className="hover:text-black cursor-pointer transition">Featured</li>
                        <li className="hover:text-black cursor-pointer transition">Spring</li>
                        <li className="hover:text-black cursor-pointer transition">Wallpapers</li>
                        <li className="hover:text-black cursor-pointer transition">3D Renders</li>
                        <li className="hover:text-black cursor-pointer transition">Nature</li>
                        <li className="hover:text-black cursor-pointer transition">Textures</li>
                        <li className="hover:text-black cursor-pointer transition">Film</li>
                        <li className="hover:text-black cursor-pointer transition">Architecture</li>
                        <li className="hover:text-black cursor-pointer transition">Street Photography</li>
                        <li className="hover:text-black cursor-pointer transition">Experimental</li>
                        <li className="hover:text-black cursor-pointer transition">Travel</li>
                        <li className="hover:text-black cursor-pointer transition">People</li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
