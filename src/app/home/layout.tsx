// src/app/home/layout.tsx
'use client';

import Navbar from '@/components/myComponents/Navbar';
import Sidebar from '@/components/myComponents/Sidebar';
import BottomNav from '@/components/myComponents/BottomNav';
import { Suspense } from 'react';

export default function HomeLayout({
  children,

}: {
  children: React.ReactNode;

}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Hidden on small screens (handled in Sidebar component too) */}
      <div className="hidden lg:block lg:w-16 fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full lg:pl-16">
        <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100"></div>}>
          <Navbar />
        </Suspense>

        <main className="flex-1 mt-[110px] md:mt-[120px] pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />


    </div>
  );
}