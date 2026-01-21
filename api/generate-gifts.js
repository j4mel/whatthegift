import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    console.log("Använder API-nyckel:", process.env.GEMINI_API_KEY ? "JA" : "NEJ");

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-2.5-flash-lite as it is stable and good at generating structured data/SVG
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const { recipient, budget, profile } = req.body;

        const prompt = `
      Du är en "Corporate Gifting Expert". Din uppgift är att föreslå de bästa gåvorna för företagssammanhang (B2B).
      Ge mig 3 kreativa, professionella och passande presenttips baserat på följande info:
      - Mottagare: ${recipient}
      - Budget: ${budget} per gåva
      - Profil: ${profile}

      VIKTIGT FÖR FORMAT OCH BILDER: 
      1. Svaret SKA vara en array med exakt 3 objekt.
      2. "name" ska vara kort och rent (1-3 ord).
      3. "image_svg" SKA vara en komplett, modern och stilren SVG-kod som illustrerar produkten.
         - Använd moderna färger, gradients och minimalistisk design.
         - SVG ska ha viewBox="0 0 400 300" och vara responsiv.
         - Undvik komplexa foton, fokusera på igenkännbara produktillustrationer (t.ex. en snygg termos, ett anteckningsblock, etc).

      Svara ENDAST med ett giltigt JSON-objekt. Inget annat.
      Strukturen ska vara:
      [
        {
          "name": "Produktnamn",
          "description": "En kort säljande beskrivning (max 2 meningar)",
          "price": "Ungefärligt pris i SEK",
          "category": "Kategori",
          "image_svg": "<svg ...>...</svg>"
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
        return res.status(500).json({
            error: 'Failed to generate gift suggestions',
            message: error.message
        });
    }
}
