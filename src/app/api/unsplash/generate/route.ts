import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        /*
        // HuggingFace InferenceClient (commented out - requires API key)
        const hfToken = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
        if (!hfToken) {
            return NextResponse.json({ error: "HF API Key missing!" }, { status: 500 });
        }
        const client = new InferenceClient(hfToken);
        const imageBlob = await client.textToImage({
            provider: "wavespeed",
            model: "black-forest-labs/FLUX.1-dev",
            inputs: prompt,
            parameters: { num_inference_steps: 5 },
        });
        const arrayBuffer = await (imageBlob as unknown as Blob).arrayBuffer();
        */

        // Pollinations.ai - 100% FREE, no API key needed, uses FLUX.1 model
        const seed = Math.floor(Math.random() * 1000000);
        const encodedPrompt = encodeURIComponent(prompt);

        // Return the URL directly - let the browser load it (avoids server-side fetch issues)
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&model=flux&nologo=true`;

        return NextResponse.json({ imageUrl });

    } catch (error: any) {
        console.error("[Generate] Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
