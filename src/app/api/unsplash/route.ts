import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query') || 'nature'
        const page = searchParams.get('page') || '1'
        const color = searchParams.get('color')
        const orientation = searchParams.get('orientation')
        const order_by = searchParams.get('order_by') || 'relevant'

        let url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=20&order_by=${order_by}`
        if (color) url += `&color=${color}`
        if (orientation) url += `&orientation=${orientation}`

        const response = await fetch(
            url,
            {
                headers: {
                    'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                },
            }
        )

        if (!response.ok) {
            throw new Error('Unsplash API Failed')
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error) {
        console.log("❌ Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        )
    }
}