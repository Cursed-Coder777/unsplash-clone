import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import Photo from '@/lib/models/Photo';
import { verifyToken } from '@/lib/utils';

// POST /api/unsplash/photo/[id]/like - Toggle like
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
        
        // 1. Get user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        // 2. Get or create photo record
        let photo = await Photo.findOne({ photoId });
        if (!photo) {
            photo = await Photo.create({ 
                photoId, 
                likesCount: 0,
                likes: [] 
            });
        }
        
        // 3. Check if user already liked
        const userLiked = photo.likes.includes(user._id);
        
        let isLiked;
        let likesCount;
        
        if (userLiked) {
            // Unlike - remove user from photo likes array
            await Photo.findByIdAndUpdate(
                photo._id,
                { 
                    $pull: { likes: user._id },
                    $inc: { likesCount: -1 }
                }
            );
            // Remove from user's likedPhotos
            await User.findByIdAndUpdate(
                decoded.userId,
                { $pull: { likedPhotos: { photoId } } }
            );
            isLiked = false;
        } else {
            // Like - add user to photo likes array
            await Photo.findByIdAndUpdate(
                photo._id,
                { 
                    $push: { likes: user._id },
                    $inc: { likesCount: 1 }
                }
            );
            // Add to user's likedPhotos
            await User.findByIdAndUpdate(
                decoded.userId,
                { $push: { likedPhotos: { photoId, likedAt: new Date() } } }
            );
            isLiked = true;
        }
        
        // 4. Get updated counts
        const updatedPhoto = await Photo.findOne({ photoId });
        likesCount = updatedPhoto?.likesCount || 0;
        
        return NextResponse.json({
            success: true,
            isLiked,
            likesCount,
            message: isLiked ? 'Photo liked' : 'Photo unliked'
        });
        
    } catch (error) {
        console.error('❌ Like error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/unsplash/photo/[id]/like - Check if user liked this photo
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: photoId } = await params;
        
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ isLiked: false, likesCount: 0 });
        }
        
        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ isLiked: false, likesCount: 0 });
        }
        
        await connectToDb();
        
        // Get photo record
        const photo = await Photo.findOne({ photoId });
        const likesCount = photo?.likesCount || 0;
        
        // Check if user liked
        const user = await User.findById(decoded.userId);
        const isLiked = user?.likedPhotos?.some((like: any) => like.photoId === photoId) || false;
        
        return NextResponse.json({ isLiked, likesCount });
        
    } catch (error) {
        console.error('Check like error:', error);
        return NextResponse.json({ isLiked: false, likesCount: 0 });
    }
}