'use client'
import Navbar from '@/components/myComponents/Navbar'
import Sidebar from '@/components/myComponents/Sidebar'
import React, { ReactNode } from 'react'
const Layout = ({ children }: { children: ReactNode }) => {

    return (
        <div className="flex">
            <div className="w-[3%]"> <Sidebar /></div>
            <div className="flex flex-col w-[97%]">
                <Navbar />
                {children}
            </div></div>
    )
}

export default Layout