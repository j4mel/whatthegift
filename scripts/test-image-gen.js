
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testImageGen() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('Missing API Key');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelsToTest = ["gemini-2.0-flash", "gemini-2.5-flash-lite"];

    for (const modelName of modelsToTest) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = "Generate a tiny 10x10 pixel PNG image of a red dot and return it as a base64 string in JSON: { \"image_base64\": \"...\" }";

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log(`Response from ${modelName}:`, text.substring(0, 100) + "...");
            if (text.includes("iVBORw0KGgoAAAANSUhEUg")) {
                console.log(`SUCCESS: ${modelName} generated an image!`);
            } else {
                console.log(`FAILED: ${modelName} did not generate a valid image string.`);
            }
        } catch (error) {
            console.error(`Error with ${modelName}:`, error.message);
        }
    }
}

testImageGen();
