
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('Error: GEMINI_API_KEY is not set in .env file.');
        process.exit(1);
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        let output = '';
        if (data.models) {
            output += '=== AVAILABLE MODELS ===\n';
            data.models.forEach(m => {
                output += `JSON_MODEL: ${JSON.stringify(m)}\n`;
            });
            output += '========================\n';
        } else {
            output += `No models found. Response: ${JSON.stringify(data, null, 2)}\n`;
        }

        fs.writeFileSync('models_list.txt', output);
        console.log('Model list written to models_list.txt');

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
