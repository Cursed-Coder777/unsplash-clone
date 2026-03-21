'use client';

import { Bookmark, Compass, Download, Folders, Framer, ImageIcon, Languages, PenTool, TextAlignJustify } from 'lucide-react';
import Link from 'next/link';
import LanguageDropdown from '@/components/myComponents/LanguageDropDown';
import UserMenu from './UserMenu';
import { RiUnsplashFill } from 'react-icons/ri';

const Sidebar = () => {
    const handleLanguageChange = (language: any) => {
        console.log('Language selected:', language);
    };

    return (
        <div className='flex h-screen flex-col items-center justify-between p-4 border-r bg-white'>
            {/* Top Icons */}
            <div className='flex flex-col gap-5 items-center'>
                <Link href='/home'>
                    <RiUnsplashFill size={28} className='text-black cursor-pointer transition-colors' />
                </Link>
                <ImageIcon size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                <PenTool size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                <Compass size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                <Folders size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                <Download size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                <Bookmark size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
            </div>

            {/* Bottom Icons */}
            <div className='flex flex-col gap-5 items-center'>
                {/* User Menu - Sidebar variant */}
                <UserMenu variant="sidebar" />

                {/* Language Dropdown */}
                <LanguageDropdown
                    trigger={
                        <Languages size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                    }
                    position="right"
                    align="top"
                    onLanguageChange={handleLanguageChange}
                />

                {/* Menu Icon */}
                <TextAlignJustify size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
            </div>
        </div>
    );
};

export default Sidebar;