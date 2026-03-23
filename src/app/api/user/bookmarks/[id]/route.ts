import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }  // ✅ Promise type
) {
    try {
        const { id } = await params;  // ✅ await karo

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        await connectToDb();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const existingBookmark = user.bookmarks?.find((b: any) => b.photoId === id);

        let isBookmarked;
        if (existingBookmark) {
            await User.findByIdAndUpdate(
                decoded.userId,
                { $pull: { bookmarks: { photoId: id } } }
            );
            isBookmarked = false;
        } else {
            await User.findByIdAndUpdate(
                decoded.userId,
                { $push: { bookmarks: { photoId: id, savedAt: new Date() } } }
            );
            isBookmarked = true;
        }

        return NextResponse.json({
            success: true,
            isBookmarked
        });

    } catch (error) {
        console.error('Bookmark error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }  // ✅ Promise type (same as POST)
) {
    try {
        const { id } = await params;  // ✅ await karo

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ isBookmarked: false });
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ isBookmarked: false });
        }

        await connectToDb();
        const user = await User.findById(decoded.userId);
        const isBookmarked = user?.bookmarks?.some((b: any) => b.photoId === id) || false;

        return NextResponse.json({ isBookmarked });

    } catch (error) {
        console.error('Check bookmark error:', error);
        return NextResponse.json({ isBookmarked: false });
    }
}