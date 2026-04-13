import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { photoId, photoData } = await req.json();
        if (!photoId) {
            return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
        }

        await connectToDb();

        // Use $push with $slice to keep only the last N downloads if needed, 
        // but for now just add it. Use $addToSet if we want unique, but download history 
        // usually allows duplicates (different times). 
        // However, the user request says "unique photo IDs as a simple array of strings" 
        // in one of the conversation summaries, but in this request they want metadata.
        // Let's stick to the current request: "Download history tracking (as described above)"
        // "downloadHistory (as described above)" refers to the previous message:
        // "downloadHistory tracking... photo metadata..."
        
        await User.findByIdAndUpdate(session.user.id, {
            $push: {
                downloadHistory: {
                    $each: [{
                        photoId,
                        photoData,
                        downloadedAt: new Date()
                    }],
                    $position: 0 // Newest first
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Download track error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectToDb();
        const user = await User.findById(session.user.id).select('downloadHistory');

        return NextResponse.json(user.downloadHistory || []);
    } catch (error) {
        console.error('Download fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
