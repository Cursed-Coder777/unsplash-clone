import React from 'react'

const SkeletonGrid = () => {
    const heights = [280, 320, 240, 360, 300, 260, 340, 280]
    
    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                <div key={item} className="break-inside-avoid mb-4">
                    <div 
                        className="w-full bg-gray-200 animate-pulse rounded-lg"
                        style={{ height: `${heights[index % heights.length]}px` }}
                    ></div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkeletonGrid