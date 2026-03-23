'use client';

import { useSession } from 'next-auth/react';
import { toast } from '@/components/myComponents/Toast';
import { useRouter } from 'next/navigation';

export const useAuthToast = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const requireAuth = (action: string = 'perform this action', callback?: () => void): boolean => {
        if (status === 'loading') return false;

        if (!session?.user) {
            toast.error(`Please login to ${action}`, 4000);

            // Optional: Show login button in toast
            setTimeout(() => {
                router.push('/login');
            }, 2000);

            return false;
        }

        if (callback) {
            callback();
        }
        return true;
    };

    return {
        requireAuth,
        isAuthenticated: !!session?.user,
        user: session?.user,
    };
};