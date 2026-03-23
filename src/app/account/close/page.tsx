import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/utils';
import CloseAccountForm from './CloseAccountForm';

export default async function CloseAccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }
    
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
        redirect('/login');
    }

    return <CloseAccountForm />;
}
