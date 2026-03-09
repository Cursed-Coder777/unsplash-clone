'use client';
import { useEffect, useState } from 'react';

export const Skeleton = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`animate-pulse bg-gray-200 ${className}`} />
    );
};

// Fixed pattern - same on server and client
const skeletonHeights = [
    { col1: [320, 280, 360], col2: [280, 320, 240], col3: [360, 280, 320], col4: [240, 360, 280] }
];

export const ImageSkeleton = ({ column = 0, index = 0 }: { column?: number; index?: number }) => {
    // Deterministic height based on column and index
    const heights = [
        [320, 280, 360], // Column 1
        [280, 320, 240], // Column 2
        [360, 280, 320], // Column 3
        [240, 360, 280]  // Column 4
    ];

    const colHeights = heights[column % heights.length];
    const height = colHeights[index % colHeights.length];

    return (
        <div className="w-full animate-pulse">
            <div
                className="w-full bg-gray-200 "
                style={{ height: `${height}px` }}
            />
        </div>
    );
};

export const GridSkeleton = () => {
    return (
        <div className="my-masonry-grid">
            {[0, 1, 2, 3].map((col) => (
                <div key={col} className="my-masonry-grid_column">
                    {[0, 1, 2].map((idx) => (
                        <ImageSkeleton key={idx} column={col} index={idx} />
                    ))}
                </div>
            ))}
        </div>
    );
};