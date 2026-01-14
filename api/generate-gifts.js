import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { recipient, interest, occasion, budget } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
      Du är en expert på att ge presenttips.
      Ge mig 3 kreativa, roliga och passande presenttips baserat på följande info:
      - Mottagare: ${recipient}
      - Intresse: ${interest}
      - Tillfälle: ${occasion}
      - Budget: ${budget} (Budget=billigt, Mellan=normalt, Premium=dyrt)

      Svara ENDAST med en JSON-array. Ingenting annat.
      Varje objekt i arrayen ska ha följande struktur:
      {
        "name": "Produktnamn",
        "description": "En kort säljande beskrivning (max 2 meningar)",
        "price": "Ungefärligt pris i SEK",
        "category": "Kategori"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks from the response
        const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();

        const suggestions = JSON.parse(jsonString);

        return res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error generating gifts:', error);
        return res.status(500).json({ error: 'Failed to generate gift suggestions' });
    }
}
