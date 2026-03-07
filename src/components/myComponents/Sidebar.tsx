import { Bookmark, Compass, Download, Folders, Framer, ImageIcon, Languages, PenTool, TextAlignJustify, User } from 'lucide-react'
import Link from 'next/link'


const Sidebar = () => {
    return (
        <div className='flex h-screen flex-col items-center justify-between p-4 border-r '>
            <div className='flex flex-col gap-5'>
                <Link href='/home'>
                    <Framer size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} /></Link>
                <ImageIcon size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />
                <PenTool size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />

                <Compass size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />
                <Folders size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />
                <Download size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />
                <Bookmark size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />
            </div>
            <div className='flex flex-col gap-5'>
                <Link href='/login'>

                    <User fill='#767676' className={`text-[#767676] hover:text-black cursor-pointer`} /></Link>
                <Languages size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />
                <TextAlignJustify size={24} strokeWidth={2} className={`text-[#767676] hover:text-black cursor-pointer`} />
            </div>
        </div>
    )
}

export default Sidebar