// src/app/api/ai/search/expand/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert at optimizing image search queries. 
        Given a user's search query, expand it into a set of 5-8 descriptive keywords and visual concepts that would help an image search engine (like Unsplash) find the most relevant, high-quality, and aesthetically pleasing photos that match the "mood" and "intent" of the user.
        
        Examples:
        - "lonely beach" -> "seashore, solitude, empty sand, dramatic sky, minimalist beach, cinematic ocean"
        - "sunset at mountains during winter" -> "golden hour peaks, snow capped mountains, alpenglow, cold landscape, winter dusk"
        - "modern office" -> "minimalist workspace, architecture, clean desk, professional interior, tall windows, natural light"
        
        User Query: "${query}"
        
        Return ONLY the expanded comma-separated keywords. No extra text. No quotes.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Limit the expanded query to a reasonable length for Unsplash API
        const expandedQuery = text || query;

        return NextResponse.json({ expandedQuery });
    } catch (error) {
        console.error('AI Search Expansion error:', error);
        return NextResponse.json({ error: 'Failed to expand query' }, { status: 500 });
    }
}
