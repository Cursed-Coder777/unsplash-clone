// scripts/migrate-likes.ts
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import User from '../src/lib/models/User';
import Photo from '../src/lib/models/Photo';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function migrateLikes() {
    try {
        console.log('🔵 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to DB');
        
        // Get all users
        const users = await User.find({});
        console.log(`📊 Found ${users.length} users`);
        
        let totalLikesMigrated = 0;
        
        for (const user of users) {
            const likedPhotos = user.likedPhotos || [];
            console.log(`👤 User: ${user.username} - ${likedPhotos.length} liked photos`);
            
            for (const like of likedPhotos) {
                const photoId = like.photoId;
                
                // Find or create photo record
                let photo = await Photo.findOne({ photoId });
                if (!photo) {
                    photo = await Photo.create({ 
                        photoId, 
                        likes: [], 
                        likesCount: 0 
                    });
                    console.log(`  📸 Created photo record for: ${photoId}`);
                }
                
                // Add user to photo likes if not already
                if (!photo.likes.includes(user._id)) {
                    await Photo.findByIdAndUpdate(
                        photo._id,
                        { 
                            $push: { likes: user._id },
                            $inc: { likesCount: 1 }
                        }
                    );
                    totalLikesMigrated++;
                    console.log(`  ✅ Added like from ${user.username} to ${photoId}`);
                } else {
                    console.log(`  ⏭️ Already liked: ${user.username} -> ${photoId}`);
                }
            }
        }
        
        console.log(`\n🎉 Migration complete!`);
        console.log(`📈 Total likes migrated: ${totalLikesMigrated}`);
        
    } catch (error) {
        console.error('❌ Migration error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from DB');
        process.exit(0);
    }
}

migrateLikes();