import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import AccountForm from './AccountForm';
import { verifyToken } from '@/lib/utils';

export default async function AccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
        // If token is invalid or expired, redirect to login
        redirect('/login');
    }

    await connectToDb();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
        redirect('/login');
    }

    // Convert user data to plain object
    const userData = {
        id: user._id.toString(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        avatar: user.avatar || '',
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