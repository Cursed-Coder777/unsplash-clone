import NextAuth, { NextAuthOptions, User as NextAuthUser, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { comparePassword, generateToken } from '@/lib/utils';
import { cookies } from 'next/headers';

// Extend the built-in session and user types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image?: string | null;
        }
    }
    interface User {
        dbId?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        // ── Google OAuth ────────────────────────────────────────────────
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),

        // ── Email / Password ────────────────────────────────────────────
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await connectToDb();
                const user = await User.findOne({ email: credentials.email });
                if (!user || !user.password) return null;

                const valid = await comparePassword(credentials.password as string, user.password);
                if (!valid) return null;

                if (!user.isVerified) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    image: user.avatar || null,
                };
            },
        }),
    ],

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    await connectToDb();

                    const email = user.email;
                    if (!email) return false;

                    const googleProfile = profile as any; // profile for google includes sub, given_name, etc.
                    const googleId = googleProfile?.sub || account.providerAccountId;
                    const firstName = googleProfile?.given_name || (user.name?.split(' ')[0] || '');
                    const lastName = googleProfile?.family_name || (user.name?.split(' ').slice(1).join(' ') || '');
                    const avatar = user.image || '';

                    let existingUser = await User.findOne({ email });

                    if (!existingUser) {
                        const baseUsername = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
                        let username = baseUsername;
                        let count = 0;
                        while (await User.findOne({ username })) {
                            username = `${baseUsername}${++count}`;
                        }

                        existingUser = await User.create({
                            email,
                            firstName,
                            lastName,
                            username,
                            avatar,
                            googleId,
                            provider: 'google',
                            isVerified: true,
                        });
                    } else if (!existingUser.googleId) {
                        await User.findByIdAndUpdate(existingUser._id, {
                            googleId,
                            provider: 'google',
                            isVerified: true,
                        });
                    }

                    // Set custom JWT cookie for other API routes
                    const jwtToken = generateToken(existingUser._id.toString());
                    const cookieStore = await cookies();
                    cookieStore.set('token', jwtToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 7,
                        path: '/',
                    });

                    // Attach DB id to the NextAuth user object for the jwt callback
                    user.dbId = existingUser._id.toString();

                } catch (err) {
                    console.error('Google signIn sync error:', err);
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.dbId || user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export async function GET(req: any, res: any) {
    return await handler(req, res);
}

export async function POST(req: any, res: any) {
    return await handler(req, res);
}