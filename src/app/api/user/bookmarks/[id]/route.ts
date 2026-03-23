import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: photoId } = await params;
        
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
        
        // Check if already bookmarked
        const existingBookmark = user.bookmarks?.find((b: any) => b.photoId === photoId);
        
        let isBookmarked;
        if (existingBookmark) {
            // Remove bookmark
            await User.findByIdAndUpdate(
                decoded.userId,
                { $pull: { bookmarks: { photoId } } }
            );
            isBookmarked = false;
        } else {
            // Add bookmark
            await User.findByIdAndUpdate(
                decoded.userId,
                { $push: { bookmarks: { photoId, savedAt: new Date() } } }
            );
            isBookmarked = true;
        }
        
        return NextResponse.json({
            success: true,
            isBookmarked,
            message: isBookmarked ? 'Bookmark added' : 'Bookmark removed'
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: photoId } = await params;
        
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
        const isBookmarked = user?.bookmarks?.some((b: any) => b.photoId === photoId) || false;
        
        return NextResponse.json({ isBookmarked });
        
    } catch (error) {
        console.error('Check bookmark error:', error);
        return NextResponse.json({ isBookmarked: false });
    }
}