'use client';
import Navbar from '@/components/myComponents/Navbar';
import Sidebar from '@/components/myComponents/Sidebar';
import { Suspense } from 'react';

export default function HomeLayout({
    children,
    photo     // 👈 Ye parallel route ka naam hai
}: {
    children: React.ReactNode;
    photo: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar - fixed width */}
            <div className="w-[3%] fixed left-0 top-0 h-full z-10">
                <Sidebar />
            </div>

            {/* Main content - with left margin for sidebar */}
            <div className="flex flex-col w-full ml-[3%]">
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
                <main className="flex-1 p-6 mt-30">
                    {children}
                </main>
            </div>

            {/* ✅ Modal outside main - fixed over everything */}
           <div className='z-40'>
             {photo}
           </div>
        </div>
    );
}