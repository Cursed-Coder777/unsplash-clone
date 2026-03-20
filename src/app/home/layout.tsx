'use client';

import Navbar from '@/components/myComponents/Navbar';
import Sidebar from '@/components/myComponents/Sidebar';
import { Suspense } from 'react';

export default function HomeLayout({
  children,
  modal,  // 👈 Parallel route slot
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[3%] fixed left-0 top-0 h-full z-10">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col w-full ml-[3%]">
        <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100"></div>}>
          <Navbar />
        </Suspense>
        <main className="flex-1 p-6 mt-27">
          {children}
        </main>
      </div>

      {/* Modal - renders over everything */}
      {modal}
    </div>
  );
}