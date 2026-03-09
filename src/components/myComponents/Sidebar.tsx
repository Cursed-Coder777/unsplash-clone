'use client'
import { Bookmark, Compass, Download, Folders, Framer, ImageIcon, Languages, PenTool, TextAlignJustify, User } from 'lucide-react'
import Link from 'next/link'
import LanguageDropdown from '@/components/myComponents/LanguageDropDown'
import { useCallback, useMemo } from 'react'

const TOP_ICONS = [
    { Icon: Framer, href: '/home' },
    { Icon: ImageIcon },
    { Icon: PenTool },
    { Icon: Compass },
    { Icon: Folders },
    { Icon: Download },
    { Icon: Bookmark },
]

const Sidebar = () => {
    const handleLanguageChange = useCallback((language: any) => {
        console.log('Language selected:', language)
    }, [])

    const topIconsList = useMemo(() => TOP_ICONS.map(({ Icon, href }, index) => {
        const iconElement = (
            <Icon 
                key={index} 
                size={24} 
                strokeWidth={2} 
                className='text-[#767676] hover:text-black cursor-pointer transition-colors' 
            />
        )
        return href ? <Link key={index} href={href}>{iconElement}</Link> : iconElement
    }), [])

    return (
        <div className='flex h-screen flex-col items-center justify-between p-4 border-r bg-white'>
            <div className='flex flex-col gap-5'>
                {topIconsList}
            </div>

            <div className='flex flex-col gap-5'>
                <Link href='/login'>
                    <User size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                </Link>

                <LanguageDropdown
                    trigger={
                        <Languages size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
                    }
                    position="right"
                    align="top"
                    onLanguageChange={handleLanguageChange}
                />

                <TextAlignJustify size={24} strokeWidth={2} className='text-[#767676] hover:text-black cursor-pointer transition-colors' />
            </div>
        </div>
    )
}

export default Sidebar