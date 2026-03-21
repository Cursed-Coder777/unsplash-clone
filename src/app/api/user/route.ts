// app/api/user/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectToDb } from '@/lib/db'
import User from '@/lib/models/User'
import { verifyToken } from '@/lib/utils'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        console.log('Token found:', !!token) // Debug log

        if (!token) {
            return NextResponse.json({ user: null })
        }

        const decoded = verifyToken(token)
        console.log('Decoded token:', decoded) // Debug log

        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ user: null })
        }

        await connectToDb()
        const user = await User.findById(decoded.userId).select('-password')
        
        console.log('User found:', !!user) // Debug log

        if (!user) {
            return NextResponse.json({ user: null })
        }

        return NextResponse.json({ 
            user: {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                avatar: user.avatar || '',
            }
        })
    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json({ user: null })
    }
}