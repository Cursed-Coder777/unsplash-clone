'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/myComponents/Navbar';
import Sidebar from '@/components/myComponents/Sidebar';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleSearch = (term: string) => {
        if (term.trim()) {
            // URL update karo with search term
            router.push(`/home?q=${encodeURIComponent(term)}`);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar - fixed width */}
            <div className="w-[3%] fixed left-0 top-0 h-full z-10">
                <Sidebar />
            </div>

            {/* Main content - with left margin for sidebar */}
            <div className="flex flex-col w-full ml-[3%]">
                <Navbar onSearch={handleSearch} />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}