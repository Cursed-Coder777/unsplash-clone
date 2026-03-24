// src/components/myComponents/Skeleton.tsx
'use client'

const Skeleton = ({ className }: { className?: string }) => {
    return (
        <div className={`relative overflow-hidden bg-gray-100 rounded-xl ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>
    )
}

export const PhotoSkeleton = () => {
    // Deterministic heights to prevent hydration mismatch
    const heights = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]', 'aspect-square', 'aspect-[3/2]']

    return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index) => {
                const height = heights[index % heights.length]
                return (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className={`w-full ${height}`} />
                        <div className="flex items-center gap-2 px-1">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="w-24 h-4 rounded-md" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Skeleton
