import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils';

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
        const { firstName, lastName, email, username, bio, location, website, instagram, twitter, paypal, messageEnabled, hireEnabled } = body;

        await connectToDb();

        // Check if username is taken by another user
        if (username !== body.username) {
            const existingUser = await User.findOne({ username, _id: { $ne: decoded.userId } });
            if (existingUser) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }
        }

        // Check if email is taken by another user
        if (email !== body.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: decoded.userId } });
            if (existingUser) {
                return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            {
                firstName,
                lastName,
                email,
                username,
                bio,
                location,
                website,
                instagram,
                twitter,
                paypal,
                messageEnabled,
                hireEnabled,
            },
            { new: true, runValidators: true }
        ).select('-password');

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}