import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// 'imagen-3.0-generate-001' ya 'imagen-3' region ke hisaab se vary karta hai
// Lekin hum isse API route mein handle karenge
export { genAI };