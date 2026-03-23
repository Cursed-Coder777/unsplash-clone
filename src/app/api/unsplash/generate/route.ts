import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const hfToken = process.env.HUGGINGFACE_API_KEY;
        if (!hfToken) {
            return NextResponse.json({ error: "Hugging Face API Key is missing! .env file mein 'HUGGINGFACE_API_KEY=YOUR_TOKEN' add karein." }, { status: 500 });
        }

        // Use standard high-quality model
        const modelUrl = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";

        const response = await fetch(modelUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${hfToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) {
            const errResult = await response.json().catch(() => ({}));

            // HuggingFace models have a 3-5 minute warm-up time if they are unloaded.
            // If we hit a 503 "Model is loading", we should tell the user.
            if (response.status === 503 && errResult.error?.includes("loading")) {
                const waitTime = errResult.estimated_time || 20;
                throw new Error(`AI Model is currently waking up... Please try again in ${Math.ceil(waitTime)} seconds.`);
            }

            throw new Error(`HuggingFace Error: ${errResult.error || response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');

        return NextResponse.json({ image: `data:image/jpeg;base64,${base64Data}` });

    } catch (error: any) {
        console.error("AI Image Generation Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
