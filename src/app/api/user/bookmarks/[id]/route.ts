// src/app/api/user/bookmarks/[id]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        
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
        
        // BUG FIX: was using b.id (MongoDB _id) instead of b.photoId
        const existingBookmark = user.bookmarks?.find((b: any) => b.photoId === id);
        
        let isBookmarked;
        if (existingBookmark) {
            // BUG FIX: $pull must match the field name used in schema (photoId)
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
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        
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
        // BUG FIX: was using b.id (MongoDB _id) instead of b.photoId
        const isBookmarked = user?.bookmarks?.some((b: any) => b.photoId === id) || false;

        return NextResponse.json({ isBookmarked });
        
    } catch (error) {
        console.error('Check bookmark error:', error);
        return NextResponse.json({ isBookmarked: false });
    }
}