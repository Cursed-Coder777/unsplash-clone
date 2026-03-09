
import Navbar from '@/components/myComponents/Navbar'
import Sidebar from '@/components/myComponents/Sidebar'

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
                <Navbar />
                <main className="flex-1 overflow-y-auto mt-[120px] p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}