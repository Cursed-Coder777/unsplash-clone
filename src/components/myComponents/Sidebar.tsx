// src/components/myComponents/Sidebar.tsx
'use client';

import {
    BarChart3,
    Bookmark,
    Compass,
    Download,
    Folders,
    ImageIcon,
    Languages,
    PenTool,
    TextAlignJustify,
    Wand2
} from 'lucide-react';
import Link from 'next/link';
import LanguageDropdown from '@/components/myComponents/LanguageDropDown';
import Tooltip from '@/components/myComponents/Tooltip';
import UserMenu from './UserMenu';
import { RiUnsplashFill } from 'react-icons/ri';

const Sidebar = () => {
    const handleLanguageChange = (language: any) => {
        console.log('Language selected:', language);
    };

    return (
        <div className='flex h-screen flex-col items-center justify-between p-4 border-r bg-white w-full'>
            {/* Top Icons */}
            <div className='flex flex-col gap-6 items-center'>
                <Link href='/home'>
                    <RiUnsplashFill size={30} className='text-black cursor-pointer transition-colors mb-2' />
                </Link>
                <div className="flex flex-col gap-5 items-center">
                    <Tooltip text="AI Generate" position="right">
                        <Link href="/home/generate">
                            <Wand2 size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                        </Link>
                    </Tooltip>
                    <Tooltip text="Photos" position="right">
                        <ImageIcon size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                    </Tooltip>
                    <Tooltip text="Tools" position="right">
                        <PenTool size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                    </Tooltip>
                    <Tooltip text="Explore" position="right">
                        <Compass size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                    </Tooltip>

                    <Tooltip text="Collections" position="right">
                        <Link href="/collections">
                            <Folders size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                        </Link>
                    </Tooltip>
                    <Tooltip text="Downloads" position="right">
                        <Download size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                    </Tooltip>
                    <Tooltip text="Bookmarks" position="right">
                        <Link href="/account/bookmarks">
                            <Bookmark size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                        </Link>
                    </Tooltip>
                    <Tooltip text="Analytics" position="right">
                        <Link href="/admin/ads">
                            <BarChart3 size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                        </Link>
                    </Tooltip>
                </div>
            </div>

            {/* Bottom Icons */}
            <div className='flex flex-col gap-6 items-center'>
                {/* User Menu - Sidebar variant */}
                <UserMenu variant="sidebar" />

                {/* Language Dropdown */}
                <Tooltip text="Language" position="right">
                    <LanguageDropdown
                        trigger={
                            <Languages size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                        }
                        position="right"
                        align="top"
                        onLanguageChange={handleLanguageChange}
                    />
                </Tooltip>

                {/* Menu Icon */}
                <Tooltip text="Menu" position="right">
                    <TextAlignJustify size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                </Tooltip>
            </div>
        </div>
    );
};

export default Sidebar;