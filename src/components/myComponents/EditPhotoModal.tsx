'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Scissors, Download, RefreshCcw, Maximize2, Check } from 'lucide-react'
import Image from 'next/image'

interface EditPhotoModalProps {
    photo: {
        id: string;
        urls: { raw: string; regular: string };
        width: number;
        height: number;
    };
    onClose: () => void;
    onDownload: (url: string, filename: string) => void;
}

const RATIO_PRESETS = [
    { label: 'Original', value: 'original', icon: <Maximize2 size={18} /> },
    { label: 'Square (1:1)', value: '1:1', ratio: 1 },
    { label: 'Portrait (4:5)', value: '4:5', ratio: 0.8 },
    { label: 'Landscape (16:9)', value: '16:9', ratio: 1.77 },
]

export default function EditPhotoModal({ photo, onClose, onDownload }: EditPhotoModalProps) {
    const [selectedRatio, setSelectedRatio] = useState('original')
    const [width, setWidth] = useState(photo.width)
    const [height, setHeight] = useState(photo.height)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleRatioChange = (preset: any) => {
        setSelectedRatio(preset.value)
        if (preset.value === 'original') {
            setWidth(photo.width)
            setHeight(photo.height)
        } else {
            // Adjust dimensions based on ratio
            const newHeight = Math.round(width / preset.ratio)
            setHeight(newHeight)
        }
    }

    const generateUnsplashUrl = () => {
        const baseUrl = photo.urls.raw.split('?')[0] || photo.urls.raw
        const params = new URLSearchParams()
        params.append('q', '80')
        params.append('w', width.toString())
        params.append('h', height.toString())

        if (selectedRatio !== 'original') {
            params.append('fit', 'crop')
            params.append('crop', 'faces,edges') // Smart crop
        } else {
            params.append('fit', 'max')
        }

        return `${baseUrl}?${params.toString()}`
    }

    const previewUrl = useMemo(() => {
        const baseUrl = photo.urls.regular.split('?')[0] || photo.urls.regular
        const params = new URLSearchParams()
        params.append('w', '800')
        params.append('h', Math.round(800 * (height / width)).toString())
        if (selectedRatio !== 'original') {
            params.append('fit', 'crop')
        }
        return `${baseUrl}?${params.toString()}`
    }, [width, height, selectedRatio, photo.urls.regular])

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">

                {/* 🖼️ Preview Area */}
                <div className="flex-1 bg-gray-50 dark:bg-black/40 p-4 md:p-8 flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-full">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image 
                            src={previewUrl} 
                            alt="Crop Preview" 
                            fill 
                            className="object-contain transition-all duration-500 drop-shadow-2xl"
                            onLoadingComplete={() => setIsUpdating(false)}
                            unoptimized
                        />
                        {isUpdating && (
                            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
                                <RefreshCcw size={32} className="animate-spin text-gray-800 dark:text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 🛠️ Controls Sidebar */}
                <div className="w-full md:w-80 border-l border-gray-100 dark:border-gray-800 p-6 flex flex-col bg-white dark:bg-[#0a0a0a]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Scissors size={20} className="text-gray-400" />
                            <h2 className="text-lg font-bold dark:text-white">Edit Photo</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="space-y-8 flex-1">
                        {/* Aspect Ratio Presets */}
                        <section>
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Aspect Ratio</label>
                            <div className="grid grid-cols-2 gap-3">
                                {RATIO_PRESETS.map((preset) => (
                                    <button
                                        key={preset.value}
                                        onClick={() => handleRatioChange(preset)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 ${selectedRatio === preset.value ? 'border-black dark:border-white bg-gray-50 dark:bg-white/5' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'}`}
                                    >
                                        <div className="text-gray-400 group-hover:text-black">
                                            {selectedRatio === preset.value ? <Check size={16} className="text-black dark:text-white" /> : preset.icon || <Maximize2 size={18} />}
                                        </div>
                                        <span className={`text-[11px] font-bold ${selectedRatio === preset.value ? 'text-black dark:text-white' : 'text-gray-500'}`}>{preset.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Dimensions */}
                        <section>
                            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Dimensions (px)</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => { setWidth(parseInt(e.target.value)); setSelectedRatio('custom'); }}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-sm font-bold dark:text-gray-200 outline-none focus:border-black dark:focus:border-white transition-colors"
                                    />
                                </div>
                                <span className="text-gray-400 font-bold">×</span>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => { setHeight(parseInt(e.target.value)); setSelectedRatio('custom'); }}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-sm font-bold dark:text-gray-200 outline-none focus:border-black dark:focus:border-white transition-colors"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <button
                        onClick={() => onDownload(generateUnsplashUrl(), `unsplash-edit-${photo.id}.jpg`)}
                        className="w-full mt-auto py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
                    >
                        <Download size={20} />
                        <span>Download Edit</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
