// src/app/api/collections/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDb } from '@/lib/db';
import Collection from '@/lib/models/Collection';
import User from '@/lib/models/User';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDb();
        const collection = await Collection.findById(params.id).populate('user', 'firstName lastName username avatar');

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        // If private, only owner can view
        if (collection.isPrivate) {
            const session = await getServerSession(authOptions);
            if (!session || !session.user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const user = await User.findOne({ email: session.user.email });
            if (!user || collection.user._id.toString() !== user._id.toString()) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        return NextResponse.json({ collection });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDb();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const collection = await Collection.findById(params.id);
        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        if (collection.user.toString() !== user._id.toString()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, isPrivate, photoToAdd, photoToRemove } = body;

        if (title !== undefined) collection.title = title;
        if (description !== undefined) collection.description = description;
        if (isPrivate !== undefined) collection.isPrivate = isPrivate;

        if (photoToAdd) {
            // Check if already in collection
            const exists = collection.photos.some((p: any) => p.photoId === photoToAdd.id);
            if (!exists) {
                collection.photos.push({
                    photoId: photoToAdd.id,
                    photoData: photoToAdd
                });
                // Update cover photo if none
                if (!collection.coverPhoto) {
                    collection.coverPhoto = photoToAdd.urls?.regular || photoToAdd.urls?.small;
                }
            }
        }

        if (photoToRemove) {
            collection.photos = collection.photos.filter((p: any) => p.photoId !== photoToRemove);
            // If we removed the cover photo, update it
            if (collection.coverPhoto && collection.photos.length > 0) {
                const firstPhoto = collection.photos[0].photoData;
                collection.coverPhoto = firstPhoto?.urls?.regular || firstPhoto?.urls?.small;
            } else if (collection.photos.length === 0) {
                collection.coverPhoto = '';
            }
        }

        await collection.save();

        return NextResponse.json({ collection });
    } catch (error) {
        console.error('Update collection error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDb();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user || !user._id) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const collection = await Collection.findById(params.id);
        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
        }

        if (collection.user.toString() !== user._id.toString()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await Collection.findByIdAndDelete(params.id);

        return NextResponse.json({ message: 'Collection deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
