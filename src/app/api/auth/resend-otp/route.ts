import { NextResponse } from 'next/server';
import {connectToDb} from '@/lib/db';
import User from '@/lib/models/User';
import { generateOTP, getOTPExpiry } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await connectToDb();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { error: 'Email already verified' },
                { status: 400 }
            );
        }

        // Generate new OTP
        const newOTP = generateOTP();
        const newExpiry = getOTPExpiry();

        user.otp = {
            code: newOTP,
            expiresAt: newExpiry,
        };
        await user.save();

        // Send new OTP email
        await sendOTPEmail(email, newOTP, user.firstName);

        return NextResponse.json({
            message: 'New OTP sent to your email',
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}