import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ bookmarks: [] });
        }
        
        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ bookmarks: [] });
        }
        
        await connectToDb();
        const user = await User.findById(decoded.userId);
        
        // Deduplicate by photoId (keep the latest savedAt for each photoId)
        const seen = new Set<string>();
        const uniqueBookmarks = (user.bookmarks || [])
            .sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
            .filter((b: any) => {
                if (seen.has(b.photoId)) return false;
                seen.add(b.photoId);
                return true;
            });

        // Silently clean up duplicates from DB if any were found
        if (uniqueBookmarks.length !== (user.bookmarks || []).length) {
            await User.findByIdAndUpdate(decoded.userId, {
                $set: { bookmarks: uniqueBookmarks }
            });
        }
        
        return NextResponse.json({ bookmarks: uniqueBookmarks });
        
    } catch (error) {
        console.error('Get bookmarks error:', error);
        return NextResponse.json({ bookmarks: [] });
    }
}