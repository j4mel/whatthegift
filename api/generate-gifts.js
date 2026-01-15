import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    console.log("Använder API-nyckel:", process.env.GEMINI_API_KEY ? "JA" : "NEJ");

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { recipient, interest, occasion, budget } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Du är en expert på att ge presenttips.
      Ge mig 3 kreativa, roliga och passande presenttips baserat på följande info:
      - Mottagare: ${recipient}
      - Intresse: ${interest}
      - Tillfälle: ${occasion}
      - Budget: ${budget} (Budget=billigt, Mellan=normalt, Premium=dyrt)

      Svara ENDAST med ett giltigt JSON-objekt. Inget annat. Inga förklaringar eller markdown-taggar.
      Strukturen ska vara en array av objekt så här:
      [
        {
          "name": "Produktnamn",
          "description": "En kort säljande beskrivning (max 2 meningar)",
          "price": "Ungefärligt pris i SEK",
          "category": "Kategori"
        }
      ]
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // More robust JSON cleaning
        let cleanText = text.trim();
        if (cleanText.includes('```')) {
            cleanText = cleanText.replace(/```json\n?|```\n?/g, '').trim();
        }

        try {
            const suggestions = JSON.parse(cleanText);
            return res.status(200).json(suggestions);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text, parseError);
            return res.status(500).json({ error: 'Invalid response format from AI' });
        }
    } catch (error) {
        console.error('Error generating gifts:', error);
        return res.status(500).json({ error: 'Failed to generate gift suggestions' });
    }
}
