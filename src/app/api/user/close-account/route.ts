import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken, comparePassword } from '@/lib/utils';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword } = body;

        if (!currentPassword) {
            return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
        }

        await connectToDb();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Only check current password if the user has a password set (not a Google-only user)
        if (user.password) {
            const isMatch = await comparePassword(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
            }
        }

        // Delete the user
        await User.findByIdAndDelete(decoded.userId);

        // Clear the token cookie
        cookieStore.delete('token');

        return NextResponse.json({
            message: 'Account deleted successfully',
        });

    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
