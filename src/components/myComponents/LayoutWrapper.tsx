'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Sidebar from '@/components/myComponents/Sidebar';
import Navbar from '@/components/myComponents/Navbar';
import BottomNav from '@/components/myComponents/BottomNav';
import ToastContainer from '@/components/myComponents/Toast';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Navbar, Sidebar, and BottomNav on login and register pages
  const isRegisterPage = pathname?.startsWith('/register');

  if (isRegisterPage) {
    return (
      <div className="flex min-h-screen bg-white">
        <main className="flex-1 w-full">
          {children}
        </main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Hidden on small screens */}
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

      <BottomNav />
      <ToastContainer />
    </div>
  );
}
