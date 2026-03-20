import Link from 'next/link';
import { Search, Bookmark, Bell, User, Menu } from 'lucide-react';

const PlusNavbar = () => {
    return (
        <nav className="w-full bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-4 flex-1">
                {/* Logo */}
                <Link href="/">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-black"
                    >
                        <path
                            d="M10 9V0H22V9H10ZM22 13H32V32H0V13H10V22H22V13Z"
                            fill="currentColor"
                        />
                    </svg>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-4xl mx-4">
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search photos and illustrations"
                            className="w-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-full h-10 pl-11 pr-4 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center gap-6">
                <button className="text-gray-500 hover:text-black transition">
                    <Bookmark size={22} />
                </button>
                <button className="text-gray-500 hover:text-black transition">
                    <Bell size={22} />
                </button>
                <button className="text-gray-200 hover:text-gray-300 transition">
                    <User size={30} className="fill-gray-200" />
                </button>
                <button className="text-gray-500 hover:text-black transition">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    )
}

export default PlusNavbar
