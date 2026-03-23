import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
}