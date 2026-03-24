// src/app/api/collections/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToDb } from '@/lib/db';
import Collection from '@/lib/models/Collection';
import User from '@/lib/models/User';

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'all', 'public', 'private'

        let query: any = { user: user._id };
        if (type === 'public') query.isPrivate = false;
        else if (type === 'private') query.isPrivate = true;

        const collections = await Collection.find(query).sort({ updatedAt: -1 });

        return NextResponse.json({ collections });
    } catch (error) {
        console.error('Fetch collections error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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

        const { title, description, isPrivate } = await request.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const newCollection = new Collection({
            user: user._id,
            title,
            description: description || '',
            isPrivate: isPrivate || false,
            photos: []
        });

        await newCollection.save();

        return NextResponse.json({ collection: newCollection });
    } catch (error) {
        console.error('Create collection error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
