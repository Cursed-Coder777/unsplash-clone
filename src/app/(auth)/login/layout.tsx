'use client'
import Navbar from '@/components/myComponents/Navbar'
import Sidebar from '@/components/myComponents/Sidebar'
import React, { ReactNode, Suspense } from 'react'
const Layout = ({ children }: { children: ReactNode }) => {

    return (
        <div className="flex">
            <div className="w-[3%] hidden lg:block lg:fixed"> <Sidebar /></div>
            <div className="flex flex-col w-full lg:pl-16 overflow-hidden mt-20">
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
                {children}
            </div>
        </div>
    )
}

export default Layout