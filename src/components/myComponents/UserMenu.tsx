'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    avatar?: string;
}

interface UserMenuProps {
    variant?: 'navbar' | 'sidebar';
}

export default function UserMenu({ variant = 'navbar' }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Fetch user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                if (res.ok && data.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Fetch user failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse border border-gray-200"></div>;
    }

    // Sidebar variant
    if (variant === 'sidebar') {
        const trigger = user ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:opacity-80 transition cursor-pointer">
                {user.avatar ? (
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-600 text-sm font-bold uppercase">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                )}
            </div>
        ) : (
            <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition">
                <UserCircle size={28} />
            </Link>
        );

        return (
            <div className="relative" ref={menuRef}>
                <button onClick={() => user && setIsOpen(!isOpen)} disabled={!user}>
                    {trigger}
                </button>

                {user && isOpen && (
                    <div className="absolute left-full ml-4 top-[-20%] w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-[9999] animate-in fade-in slide-in-from-left-2 duration-200"
                    style={{top:'-100px',right:'-250px'}}
                    >
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                            <div className="font-bold text-gray-900 text-sm">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                        
                        <div className="px-1">
                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <User size={16} className="text-gray-400" />
                                <span>Profile</span>
                            </Link>
                            <Link href="/account" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Settings size={16} className="text-gray-400" />
                                <span>Account settings</span>
                            </Link>
                        </div>

                        <div className="border-t border-gray-50 mt-1 pt-1 px-1">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default Navbar Variant
    if (!user) return <Link href="/login" className="text-[#767676] hover:text-black text-sm font-medium">Login</Link>;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full transition-all"
            >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex items-center justify-center">
                    {user.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-600 text-xs font-bold uppercase ">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <div className="font-bold text-gray-900 text-sm">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <div className="px-1">
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                            <User size={16} className="text-gray-400" />
                            <span>Profile</span>
                        </Link>
                        <Link href="/account" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                            <Settings size={16} className="text-gray-400" />
                            <span>Account settings</span>
                        </Link>
                    </div>
                    <div className="border-t border-gray-50 mt-1 pt-1 px-1">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}