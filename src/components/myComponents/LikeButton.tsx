'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/myComponents/Toast';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
    photoId: string;
    size?: number;
    className?: string;
    initialLikesCount?: number;
    onLikeChange?: (isLiked: boolean, newCount: number) => void;
}

export default function LikeButton({
    photoId,
    size = 24,
    className = '',
    initialLikesCount = 0,
    onLikeChange
}: LikeButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);

    // Check initial like status
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (status !== 'authenticated') {
                setLikesCount(initialLikesCount || 0);
                return;
            }

            try {
                const res = await fetch(`/api/unsplash/photo/${photoId}/like`);
                const data = await res.json();
                setIsLiked(data.isLiked || false);
                if (data.likesCount !== undefined) {
                    setLikesCount(data.likesCount);
                }
            } catch (error) {
                console.error('Check like error:', error);
            }
        };
        checkLikeStatus();
    }, [photoId, status, initialLikesCount]);

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // ✅ Auth check
        if (status !== 'authenticated') {
            toast.error('Please login to like photos');
            // setTimeout(() => router.push('/login'), 1500);
            return;
        }

        if (loading) return;

        setLoading(true);

        const newIsLiked = !isLiked;
        const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;

        setIsLiked(newIsLiked);
        setLikesCount(newCount);
        setAnimate(true);

        setTimeout(() => setAnimate(false), 300);

        if (onLikeChange) onLikeChange(newIsLiked, newCount);

        try {
            const res = await fetch(`/api/unsplash/photo/${photoId}/like`, {
                method: 'POST',
            });
            const data = await res.json();

            setIsLiked(data.isLiked);
            setLikesCount(data.likesCount || 0);

            if (onLikeChange) onLikeChange(data.isLiked, data.likesCount || 0);

            toast.success(data.isLiked ? 'Liked!' : 'Unliked!');

        } catch (error) {
            setIsLiked(!newIsLiked);
            setLikesCount(newIsLiked ? likesCount - 1 : likesCount + 1);
            toast.error('Something went wrong');
            console.error('Like error:', error);
        } finally {
            setLoading(false);
        }
    };

    const displayCount = likesCount ?? 0;

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-2 transition-all duration-200 cursor-pointer group bg-white w-[40px] h-[32px] rounded-lg px-1.5 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-400'
                } ${loading ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
        >
            <Heart
                size={size}
                fill={isLiked ? '#ef4444' : 'none'}
                className={`transition-all duration-300 ${isLiked
                    ? 'text-red-500 scale-110'
                    : 'text-gray-500 group-hover:text-red-400 group-hover:scale-110'
                    } ${animate ? 'scale-125' : ''}`}
            />
            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                {displayCount.toLocaleString()}
            </span>
        </button>
    );
}