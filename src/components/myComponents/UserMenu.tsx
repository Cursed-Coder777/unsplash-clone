'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Settings, LogOut } from 'lucide-react'

interface UserData {
    id: string
    firstName: string
    lastName: string
    email: string
    username: string
}

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Fetch current user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user')
                const data = await res.json()
                if (res.ok && data.user) {
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            setUser(null)
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    if (loading) {
        return <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
    }

    if (!user) {
        return (
            <Link href='/login'>
                <User size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
            </Link>
        )
    }

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full bg-[#E6E6E6] flex items-center justify-center text-[#767676] text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
                {user.firstName?.[0]}{user.lastName?.[0]}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute left-10 bottom-0 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                            <div className="text-xs text-gray-400 mt-1 truncate">{user.email}</div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <User size={16} className="text-gray-500" />
                                <span>View profile</span>
                            </Link>

                            <Link
                                href="/account"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings size={16} className="text-gray-500" />
                                <span>Account settings</span>
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-1">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    handleLogout()
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Logout @{user.username}</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}