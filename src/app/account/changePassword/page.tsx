import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/utils';
import ChangePasswordForm from './ChangePasswordForm';
import { toast } from '@/components/myComponents/Toast';

export default async function ChangePasswordPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        toast.error('You must be logged in to change your password.');
        redirect('/login');
    }
    
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
        redirect('/login');
    }

    return <ChangePasswordForm />;
}
