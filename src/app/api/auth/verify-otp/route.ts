import { NextResponse } from 'next/server';
import {connectToDb} from '@/lib/db';
import User from '@/lib/models/User';
import { isOTPExpired } from '@/lib/otp';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        await connectToDb();

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json(
                { error: 'Email already verified' },
                { status: 400 }
            );
        }

        // Check OTP
        if (!user.otp || user.otp.code !== otp) {
            return NextResponse.json(
                { error: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // Check if OTP expired
        if (isOTPExpired(user.otp.expiresAt)) {
            return NextResponse.json(
                { error: 'OTP expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            message: 'Email verified successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            },
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}