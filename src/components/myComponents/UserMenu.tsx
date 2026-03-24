'use client';

import { useState, useEffect, useRef } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, LogOut, UserCircle } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    avatar?: string;
    image?: string;  // For Google OAuth
    name?: string;   // For Google OAuth
}

interface UserMenuProps {
    variant?: 'navbar' | 'sidebar' | 'bottom' | 'drawer';
}

export default function UserMenu({ variant = 'navbar' }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // NextAuth session
    const { data: session, status: sessionStatus } = useSession();

    // Fetch user from our API
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user');
                const data = await res.json();
                if (res.ok && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Fetch user failed:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [refreshKey, sessionStatus]);

    // Refresh user data
    const refreshUser = () => {
        setUser(null); // Clear immediately to avoid "ghost" profile pictures
        setRefreshKey(prev => prev + 1);
    };

    // Listen for events that require data refresh
    useEffect(() => {
        const handleRefresh = () => refreshUser();
        window.addEventListener('avatarUpdated', handleRefresh);
        window.addEventListener('authChanged', handleRefresh);
        return () => {
            window.removeEventListener('avatarUpdated', handleRefresh);
            window.removeEventListener('authChanged', handleRefresh);
        };
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
            // If using NextAuth, sign out with NextAuth
            if (session) {
                await signOut({ redirect: false });
                redirect('/login')
            }
            // Also call our logout API
            await fetch('/api/auth/logout', { method: 'POST' });
            // Dispatch event to refresh UserMenu
            window.dispatchEvent(new CustomEvent('authChanged'));
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Get display name and avatar
    const displayName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email?.split('@')[0] || 'User';
    const displayAvatar = user?.avatar || user?.image || '';
    const displayInitials = (user?.firstName?.[0] || displayName?.[0] || 'U').toUpperCase();

    if (loading || sessionStatus === 'loading') {
        return <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse border border-gray-200"></div>;
    }

    // Sidebar variant
    if (variant === 'sidebar') {
        const trigger = user || session?.user ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:opacity-80 transition cursor-pointer">
                {displayAvatar ? (
                    <img
                        src={displayAvatar}
                        alt="User"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                {!displayAvatar && (
                    <span className="text-gray-600 text-sm font-bold uppercase">
                        {displayInitials}
                    </span>
                )}
            </div>
        ) : (
            <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition">
                <UserCircle size={28} />
            </Link>
        );

        if (!user && !session?.user) return trigger;

        return (
            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsOpen(!isOpen)} disabled={!user && !session?.user}>
                    {trigger}
                </button>

                {isOpen && (user || session?.user) && (
                    <div className="absolute -bottom-[100px] left-full ml-4 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-[9999] animate-in fade-in slide-in-from-left-2 duration-200">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                {displayAvatar ? (
                                    <img
                                        src={displayAvatar}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500 text-lg font-bold uppercase">
                                        {displayInitials}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-sm truncate">
                                    {user?.username || displayName}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {user?.email || session?.user?.email}
                                </div>
                                {user?.username && (
                                    <div className="text-xs text-gray-400">@{user.username}</div>
                                )}
                                {!user?.username && session?.user?.name && (
                                    <div className="text-xs text-gray-400">Google User</div>
                                )}
                            </div>
                        </div>

                        <div className="px-2 py-1">
                            <Link
                                href={`/@${user?.username || session?.user?.email?.split('@')[0]}`}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <User size={16} className="text-gray-400" />
                                <span>View profile</span>
                            </Link>
                            <Link
                                href="/account/"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings size={16} className="text-gray-400" />
                                <span>Account settings</span>
                            </Link>
                        </div>

                        <div className="border-t border-gray-100 mt-1 pt-1 px-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <LogOut size={16} />
                                <span>Sign out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Mobile Drawer Footer Variant
    if (variant === 'drawer') {
        if (!user && !session?.user && sessionStatus !== 'authenticated') {
            return (
                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="block w-full text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        Join Free
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <Link
                    href="/account"
                    className="flex items-center gap-3 w-full bg-white border border-gray-200 p-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                        {displayAvatar ? (
                            <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500 font-bold uppercase">{displayInitials}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold truncate text-gray-900">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate">View Profile</p>
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-center text-sm text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors border border-red-50"
                >
                    Sign out
                </button>
            </div>
        );
    }

    // Default Navbar/Bottom Variant
    if (!user && !session?.user) {
        return (
            <Link href="/login" className="text-[#767676] hover:text-black text-sm font-medium transition-colors">
                Login
            </Link>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full transition-all"
            >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex items-center justify-center">
                    {displayAvatar ? (
                        <img
                            src={displayAvatar}
                            alt="User"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    {!displayAvatar && (
                        <span className="text-gray-600 text-xs font-bold uppercase">
                            {displayInitials}
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className={`absolute right-0 ${variant === 'bottom' ? 'bottom-full mb-3' : 'mt-3'} w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in ${variant === 'bottom' ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'} duration-200`}>
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-semibold text-gray-900 text-sm truncate">
                            {displayName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {user?.email || session?.user?.email}
                        </div>
                        {user?.username && (
                            <div className="text-xs text-gray-400 mt-0.5">@{user.username}</div>
                        )}
                    </div>
                    <div className="px-2 py-1">
                        <Link
                            href={`/@${user?.username || session?.user?.email?.split('@')[0]}`}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <User size={16} className="text-gray-400" />
                            <span>Profile</span>
                        </Link>
                        <Link
                            href="/account"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings size={16} className="text-gray-400" />
                            <span>Account settings</span>
                        </Link>
                    </div>
                    <div className="border-t border-gray-100 mt-1 pt-1 px-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            <LogOut size={16} />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}