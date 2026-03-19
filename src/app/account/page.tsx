import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import AccountForm from './AccountForm';
import { verifyToken } from '@/lib/utils';

export default async function AccountPage() {
    // 1. Cookies se token lo
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    // 2. Token verify karo
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
        redirect('/login');
    }

    // 3. Database se user fetch karo
    await connectToDb();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
        redirect('/login');
    }

    // 4. User data ko plain object mein convert karo
    const userData = {
        id: user._id.toString(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        instagram: user.instagram || '',
        twitter: user.twitter || '',
        paypal: user.paypal || '',
        messageEnabled: user.messageEnabled || false,
        hireEnabled: user.hireEnabled || false,
        interests: user.interests || [],
    };

    return <AccountForm user={userData} />;
}