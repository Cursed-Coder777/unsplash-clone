"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2, AlertCircle, Download } from "lucide-react";
import Image from "next/image";
import ScrollToTop from "@/components/myComponents/ScrollToTop";

export default function AIImageGenerator() {
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setError(null);
        setImage(null);

        try {
            const res = await fetch("/api/unsplash/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            // Agar status 200 nahi hai, toh response text format mein check karein
            if (!res.ok) {
                const text = await res.text();
                // Check if it's HTML (the cause of your token '<' error)
                if (text.startsWith("<!DOCTYPE")) {
                    throw new Error("Server returned HTML instead of JSON. Check if API route exists at /api/unsplash/generate/route.ts");
                }
                const errorData = JSON.parse(text);
                throw new Error(errorData.error || "Generation failed");
            }

            const data = await res.json();
            if (data.image) {
                setImage(data.image);
            } else {
                throw new Error("No image data in response");
            }
        } catch (err: any) {
            console.error("Frontend Error:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ScrollToTop />
            < div className="min-h-screen py-12 px-4 flex flex-col items-center w-full" >
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent dark:from-neutral-100 dark:to-neutral-500">
                        Create Anything
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Turn your imagination into stunning visuals using state-of-the-art AI generation.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
                    {/* Search Bar Area */}
                    <div className="flex w-full gap-2 p-2 border rounded-full bg-background shadow-md backdrop-blur-md items-center pl-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                        <Wand2 className="h-5 w-5 text-muted-foreground hidden sm:block" />
                        <input
                            type="text"
                            placeholder="Describe what you want to see..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-base placeholder:text-muted-foreground"
                            disabled={loading}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                        />

                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !prompt}
                            className="rounded-full px-4 sm:px-6 transition-all shadow-sm shrink-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-0 sm:mr-2 h-4 w-4 animate-spin" />
                                    <span className="hidden sm:inline">Generating</span>
                                </>
                            ) : (
                                "Generate"
                            )}
                        </Button>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl w-full animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {/* Image Output Display */}
                    <div className="w-full relative mt-4">
                        {loading ? (
                            // Skeleton Loader
                            <div className="w-full aspect-square rounded-2xl bg-muted border overflow-hidden relative isolate">
                                {/* Pulse base */}
                                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                                {/* Moving gradient shimmer */}
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
                                {/* Central spinner icon optional */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 z-10">
                                    <Loader2 className="h-10 w-10 animate-spin mb-2" />
                                    <p className="text-sm font-medium">Manifesting your vision...</p>
                                </div>
                            </div>
                        ) : image ? (
                            // Result Image
                            <div className="w-full aspect-square rounded-2xl border bg-neutral-100 dark:bg-neutral-900 shadow-xl overflow-hidden relative group transition-all hover:shadow-2xl animate-in zoom-in-95 duration-500">
                                <img
                                    src={image}
                                    alt={prompt}
                                    className="object-cover w-full h-full"
                                />
                                {/* Overlay hover effect */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Button 
                                        variant="secondary" 
                                        className="rounded-full shadow-lg" 
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = image;
                                            a.download = `ai-generated.jpg`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        }}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Image
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Empty State placeholder
                            <div className="w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                                <Wand2 className="h-12 w-12 opacity-20 mb-4" />
                                <p className="text-sm">Your creation will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
}