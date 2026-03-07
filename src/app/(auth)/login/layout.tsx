'use client'
import Navbar from '@/components/myComponents/Navbar'
import Sidebar from '@/components/myComponents/Sidebar'
import { useRouter } from 'next/navigation'
import React, { ReactNode } from 'react'
const Layout = ({ children }: { children: ReactNode }) => {

    const router = useRouter()
    const handleSearch = (term: string) => {
        if (term.trim()) {
            // URL update karo with search term
            router.push(`/home?q=${encodeURIComponent(term)}`);
        }
    };

    return (
        <div className="flex">
            <div className="w-[3%]"> <Sidebar /></div>
            <div className="flex flex-col w-[97%]">
                <Navbar onSearch={handleSearch} />
                {children}
            </div></div>
    )
}

export default Layout