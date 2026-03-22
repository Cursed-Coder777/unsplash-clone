// src/components/myComponents/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, User, Image as ImageIcon } from 'lucide-react';
import UserMenu from './UserMenu';

const BottomNav = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between z-50">
            <Link href="/home" className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-black' : 'text-[#767676]'}`}>
                <Home size={24} strokeWidth={isActive('/home') ? 2.5 : 2} />
            </Link>
            
            <Link href="/home" className="flex flex-col items-center gap-1 text-[#767676]">
                <Search size={24} strokeWidth={2} />
            </Link>

            <Link href="/home" className="flex flex-col items-center gap-1 text-[#767676]">
                <PlusSquare size={24} strokeWidth={2} />
            </Link>

            {/* Use the 'bottom' variant so the dropdown opens UPWARDS */}
            <div className="scale-90">
                <UserMenu variant="bottom" />
            </div>
        </div>
    );
};

export default BottomNav;
