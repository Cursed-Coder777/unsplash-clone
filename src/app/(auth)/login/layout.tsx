'use client'
import Navbar from '@/components/myComponents/Navbar'
import Sidebar from '@/components/myComponents/Sidebar'
import React, { ReactNode, Suspense } from 'react'
const Layout = ({ children }: { children: ReactNode }) => {

    return (
        <div className="flex">
            <div className="w-[3%]"> <Sidebar /></div>
            <div className="flex flex-col w-[97%]">
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
                {children}
            </div></div>
    )
}

export default Layout