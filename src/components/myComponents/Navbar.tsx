'use client'
import Link from "next/link";
import { Search, Focus } from "lucide-react";
import { useState, FormEvent } from "react";

interface NavbarProps {
    onSearch: (searchTerm: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <nav className="w-full bg-white border-b border-gray-200">
            <div className="p-4">
                {/* Top row */}
                <div className="flex items-center gap-4">
                    {/* Search bar */}
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex bg-[#76767620] hover:bg-[#76767640] h-10 justify-center items-center p-4 rounded-full">
                            <button type="submit" className="flex items-center">
                                <Search size={18} className="text-gray-500" />
                            </button>
                            <div className="w-full h-10">
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search photos and illustrations"
                                    className="w-full h-full pl-1 outline-none border-none bg-transparent text-gray-700"
                                />
                            </div>
                            <button type="button">
                                <Focus size={18} className="text-gray-500" />
                            </button>
                        </div>
                    </form>

                    {/* Right side buttons */}
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

                {/* Categories */}
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
    );
};

export default Navbar;