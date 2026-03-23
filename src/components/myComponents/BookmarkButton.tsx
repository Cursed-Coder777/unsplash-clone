'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/myComponents/Toast';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
    photoId: string;
    size?: number;
    className?: string;
}

export default function BookmarkButton({ photoId, size = 18, className = '' }: BookmarkButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check initial bookmark status
    useEffect(() => {
        const checkBookmark = async () => {
            if (status !== 'authenticated') return;

            try {
                const res = await fetch(`/api/user/bookmarks/${photoId}`);
                const data = await res.json();
                setIsBookmarked(data.isBookmarked);
            } catch (error) {
                console.error('Check bookmark error:', error);
            }
        };
        checkBookmark();
    }, [photoId, status]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // ✅ Auth check
        if (status !== 'authenticated') {
            toast.error('Please login to save photos');
            // setTimeout(() => router.push('/login'), 1500);
            return;
        }

        if (loading) return;

        setLoading(true);
        const newIsBookmarked = !isBookmarked;
        setIsBookmarked(newIsBookmarked);

        try {
            const res = await fetch(`/api/user/bookmarks/${photoId}`, {
                method: 'POST',
            });
            const data = await res.json();
            setIsBookmarked(data.isBookmarked);

            toast.success(data.isBookmarked ? 'Saved to bookmarks!' : 'Removed from bookmarks');

        } catch (error) {
            setIsBookmarked(!newIsBookmarked);
            toast.error('Failed to save');
            console.error('Toggle bookmark error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`w-[40px] h-[32px] flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${isBookmarked
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