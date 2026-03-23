'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
    photoId: string;
    size?: number;
    className?: string;
}

export default function BookmarkButton({ photoId, size = 20, className = '' }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check initial bookmark status
    useEffect(() => {
        const checkBookmark = async () => {
            try {
                // ✅ Updated API path
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

        try {
            // ✅ Updated API path
            const res = await fetch(`/api/user/bookmarks/${photoId}`, {
                method: 'POST',
            });
            const data = await res.json();
            console.log('Toggle bookmark response:', data);
            setIsBookmarked(data.isBookmarked);
        } catch (error) {
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
            className={`${className} transition-colors cursor-pointer w-[40px] h-[32px] flex items-center justify-center`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <Bookmark
                size={size}
                fill={isBookmarked ? '#F0B100' : 'none'}
                className={isBookmarked ? 'text-yellow-500' : 'text-gray-600 hover:text-black'}
            />
        </button>
    );
}