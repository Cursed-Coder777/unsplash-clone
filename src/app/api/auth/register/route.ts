// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/utils';
import { generateOTP, getOTPExpiry } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';

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

        // 7. Generate OTP
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry();
        console.log('🔢 Generated OTP:', otp, 'Expires at:', otpExpiry);

        // 8. Create user (unverified with OTP)
        console.log('👤 Creating user...');
        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            isVerified: false,                    // ✅ Email not verified yet
            otp: {
                code: otp,
                expiresAt: otpExpiry,
            },
        });

        console.log('✅ User created successfully:', user._id);

        // 9. Send OTP email (try-catch to not fail registration if email fails)
        try {
            await sendOTPEmail(email, otp, firstName);
            console.log('📧 OTP email sent successfully');
        } catch (emailError) {
            console.error('❌ Failed to send OTP email:', emailError);
            // Don't fail registration, just log error
            // User can request resend later
        }

        // 10. Return response WITHOUT token (wait for verification)
        const response = NextResponse.json({
            message: 'User created successfully. Please verify your email.',
            email: user.email,
            requiresVerification: true,
        }, { status: 201 });

        // ❌ DO NOT set token cookie until email is verified
        // Cookie will be set after OTP verification

        return response;

    } catch (error) {
        console.error('❌ Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}