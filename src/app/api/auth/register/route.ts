import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { generateToken, hashPassword } from '@/lib/utils';

export async function POST(request: Request) {
    try {
        // 1. Request body parse karo
        const body = await request.json();
        const { firstName, lastName, email, username, password } = body;
        
        console.log('📝 Registration attempt:', { firstName, lastName, email, username });

        // 2. Validation - required fields
        if (!firstName || !lastName || !email || !username || !password) {
            console.log('❌ Missing fields');
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // 3. Password length check
        if (password.length < 8) {
            console.log('❌ Password too short');
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // 4. Connect to database
        console.log('🔄 Connecting to database...');
        await connectToDb();

        // 5. Check if user already exists
        console.log('🔍 Checking existing user...');
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            console.log('❌ User already exists');
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // 6. Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await hashPassword(password);

        // 7. Create user
        console.log('👤 Creating user...');
        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
        });

        console.log('✅ User created successfully:', user._id);

        // 8. Generate token
        const token = generateToken(user._id);

        // 9. Return response with cookie
        const response = NextResponse.json({
            message: 'User created successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            },
        }, { status: 201 });

        // 10. Set cookie
        // response.cookies.set('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 60 * 60 * 24 * 7, // 7 days
        //     path: '/',
        // });

        return response;

    } catch (error) {
        console.error('❌ Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}