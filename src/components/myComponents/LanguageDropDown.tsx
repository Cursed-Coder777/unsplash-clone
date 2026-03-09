'use client'
import { useState, useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

interface Language {
    code: string
    name: string
    flag?: string
}

interface LanguageDropdownProps {
    trigger: React.ReactNode
    position?: 'left' | 'right'
    align?: 'top' | 'bottom'
    onLanguageChange?: (language: Language) => void
}

const languages: Language[] = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'it', name: 'Italiano' },
    { code: 'ko', name: '한국어' },
    { code: 'pt', name: 'Português (Brasil)' },
]

const LanguageDropdown = ({
    trigger,
    position = 'right',
    align = 'bottom',
    onLanguageChange
}: LanguageDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLanguageSelect = (language: Language) => {
        setSelectedLanguage(language)
        onLanguageChange?.(language)
        setIsOpen(false)
    }

    const horizontalClass = position === 'right' ? '-right-68' : 'left-0'
    const verticalClass = align === 'bottom' ? 'top-full mt-2' : 'bottom-full -mb-20'
    const totalHeight = 40 + (44 * languages.length)

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={`absolute ${horizontalClass} ${verticalClass} w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50`}
                    style={{ height: `${totalHeight}px` }}
                >
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                        <h3 className="text-sm font-medium text-gray-700">Select Your Language</h3>
                    </div>

                    <div className="p-1" style={{ height: totalHeight - 40 }}>
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageSelect(language)}
                                className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors flex items-center justify-between group rounded-md"
                            >
                                <span className="text-gray-700">{language.name}</span>
                                {selectedLanguage.code === language.code ? (
                                    <Check size={18} className="text-[#767676]" />
                                ) : (
                                    <span className="w-5 h-5"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LanguageDropdown