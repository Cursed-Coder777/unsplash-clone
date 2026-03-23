import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import Photo from '@/lib/models/Photo';

export async function GET() {
    try {
        await connectToDb();
        
        // Get all users
        const users = await User.find({});
        let totalLikes = 0;
        
        for (const user of users) {
            const likedPhotos = user.likedPhotos || [];
            
            for (const like of likedPhotos) {
                const photoId = like.photoId;
                
                let photo = await Photo.findOne({ photoId });
                if (!photo) {
                    photo = await Photo.create({ 
                        photoId, 
                        likes: [], 
                        likesCount: 0 
                    });
                }
                
                if (!photo.likes.includes(user._id)) {
                    await Photo.updateOne(
                        { photoId },
                        { 
                            $push: { likes: user._id },
                            $inc: { likesCount: 1 }
                        }
                    );
                    totalLikes++;
                }
            }
        }
        
        return NextResponse.json({ 
            success: true, 
            totalLikes,
            message: 'Migration completed' 
        });
        
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
    }
}