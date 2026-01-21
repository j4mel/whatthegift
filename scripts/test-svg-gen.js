
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function testSvgGen() {
    if (!process.env.GEMINI_API_KEY) return;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    console.log("Testing SVG generation...");
    try {
        const prompt = "Generate a beautiful, modern, minimalistic SVG illustration of a 'Premium Coffee Set'. Use a vibrant color palette, gradients, and clean lines. Return ONLY the SVG code.";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let cleanSvg = text.trim();
        if (cleanSvg.includes('```')) {
            cleanSvg = cleanSvg.replace(/```svg\n?|```html\n?|```\n?/g, '').trim();
        }

        fs.writeFileSync('test-product.svg', cleanSvg);
        console.log("SVG generated and saved to test-product.svg");
    } catch (error) {
        console.error("SVG generation failed:", error.message);
    }
}

testSvgGen();
