import Navbar from '@/components/myComponents/Navbar'
import Sidebar from '@/components/myComponents/Sidebar'
import { Suspense } from 'react'

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="w-[3%] fixed left-0 top-0 h-full z-50 bg-white border-r border-gray-200">
                <Sidebar />
            </div>

            <div className="flex flex-col w-full ml-[3%]">
                <Suspense fallback={
                    <div className="h-[120px] border-b border-gray-200 flex items-center px-10">
                         <div className="animate-pulse bg-gray-100 h-10 w-full rounded-full"></div>
                    </div>
                }>
                    <Navbar />
                </Suspense>
                
                <main className="flex-1 overflow-y-auto mt-[120px] p-6">
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center p-20 min-h-[50vh]">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-4 text-gray-500">Searching...</p>
                        </div>
                    }>
                        {children}
                    </Suspense>
                </main>
            </div>
        </div>
    )
}