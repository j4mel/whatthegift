
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('Error: GEMINI_API_KEY is not set in .env file.');
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // Note: getGenerativeModelFactory is not exposed directly in some versions, 
        // but we can try to find a way to list models if available, 
        // or just try to instantiate a few common ones to check availability if listModels isn't straightforward.
        // However, the standard way in v1beta is actually separate.
        // Let's try the direct API call using fetch if the SDK doesn't expose it easily in this version,
        // OR just try the SDK method if it exists. 
        // Looking at the error "Call ListModels to see the list", it implies there is a way.
        // In strict 0.24.1, it might be on the main class or a manager.

        // Actually, for the JS SDK, listing models might not be a top-level helper in the same way as python.
        // Let's try a simple fetch against the REST API using the key.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log('No models found or error:', data);
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
