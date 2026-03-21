import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        console.log('🔵 1. Starting avatar upload...');

        // 1. Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            console.log('🔴 No token found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log('✅ Token found');

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            console.log('🔴 Invalid token');
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        console.log('✅ Token verified, userId:', decoded.userId);

        // 2. Get form data with image
        const formData = await request.formData();
        const file = formData.get('avatar') as File;
        
        if (!file) {
            console.log('🔴 No file uploaded');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        console.log('✅ File received:', file.name, file.size, 'bytes');

        // 3. Validate file type
        if (!file.type.startsWith('image/')) {
            console.log('🔴 Invalid file type:', file.type);
            return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
        }
        console.log('✅ File type valid:', file.type);

        // 4. Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.log('🔴 File too large:', file.size);
            return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
        }
        console.log('✅ File size valid');

        // 5. Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log('✅ Buffer created, size:', buffer.length);

        // 6. Upload to Cloudinary
        console.log('☁️ Uploading to Cloudinary...');
        console.log('Cloudinary config:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
            api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
        });

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'unsplash-clone/avatars',
                    width: 300,
                    height: 300,
                    crop: 'fill',
                    gravity: 'face',
                },
                (error: any, result: any) => {
                    if (error) {
                        console.log('🔴 Cloudinary upload error:', error.message);
                        reject(error);
                    } else {
                        console.log('✅ Cloudinary upload success:', result.secure_url);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // 7. Update user in database
        console.log('📝 Updating user in database...');
        await connectToDb();
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { avatar: (result as any).secure_url },
            { new: true }
        ).select('-password');
        console.log('✅ User updated');

        return NextResponse.json({
            message: 'Avatar updated successfully',
            avatar: (result as any).secure_url,
            user,
        });
        
    } catch (error: any) {
        console.error('🔴 Avatar upload error:', error.message);
        console.error('🔴 Full error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload avatar' },
            { status: 500 }
        );
    }
}