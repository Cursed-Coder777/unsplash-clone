'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
    photoId: string;
    size?: number;
    className?: string;
}

export default function BookmarkButton({ photoId, size = 18, className = '' }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check initial bookmark status
    useEffect(() => {
        const checkBookmark = async () => {
            try {
                const res = await fetch(`/api/user/bookmarks/${photoId}`);
                const data = await res.json();
                setIsBookmarked(data.isBookmarked);
            } catch (error) {
                console.error('Check bookmark error:', error);
            }
        };
        checkBookmark();
    }, [photoId]);

    const handleToggle = async () => {
        if (loading) return;
        
        setLoading(true);
        
        // Optimistic update
        const newIsBookmarked = !isBookmarked;
        setIsBookmarked(newIsBookmarked);
        
        try {
            const res = await fetch(`/api/user/bookmarks/${photoId}`, {
                method: 'POST',
            });
            const data = await res.json();
            setIsBookmarked(data.isBookmarked);
        } catch (error) {
            // Revert on error
            setIsBookmarked(!newIsBookmarked);
            console.error('Toggle bookmark error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggle();
            }}
            disabled={loading}
            className={`w-[40px] h-[32px] flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
                isBookmarked 
                    ? 'text-yellow-500' 
                    : 'text-gray-500 hover:text-yellow-500'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <Bookmark
                size={size}
                fill={isBookmarked ? '#F0B100' : 'none'}
                className="transition-colors"
            />
        </button>
    );
}