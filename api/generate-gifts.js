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
        // Switching back to gemini-2.5-flash-lite as gemini-1.5-flash returned 404
        // and gemini-2.5-flash-image has 0 quota.
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const { recipient, budget, profile } = req.body;

        const prompt = `
      Du är en "Corporate Gifting Expert". Din uppgift är att föreslå de bästa gåvorna för företagssammanhang (B2B).
      Ge mig 3 kreativa, professionella och passande presenttips baserat på följande info:
      - Mottagare: ${recipient}
      - Budget: ${budget} per gåva
      - Profil: ${profile}

      VIKTIGT FÖR FORMAT: 
      1. Ge mig 3 förslag.
      2. "name" ska vara kort och rent (1-3 ord).
      3. "image_keyword" MÅSTE vara ett ENGELSKT ord eller kort fras (1-2 ord) som beskriver produkten (t.ex. "keyboard", "coffee beans", "notebook"). Detta används för bildsöknig.

      Svara ENDAST med ett giltigt JSON-objekt. Inget annat.
      Strukturen ska vara en array av objekt så här:
      [
        {
          "name": "Produktnamn",
          "description": "En kort säljande beskrivning (max 2 meningar)",
          "price": "Ungefärligt pris i SEK",
          "category": "Kategori",
          "image_keyword": "english word"
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

            // Add Reliable Loremflickr images based on English keywords
            const suggestionsWithImages = suggestions.map((item, index) => {
                // Combine product keyword with 'gift' or 'product' for better context
                const keyword = encodeURIComponent(`${item.image_keyword || "gift"},product`);
                return {
                    ...item,
                    // Loremflickr is generally more reliable for simple keyword redirects
                    image_url: `https://loremflickr.com/800/800/${keyword}/all?lock=${index}`
                };
            });

            return res.status(200).json(suggestionsWithImages);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text, parseError);
            return res.status(500).json({ error: 'Invalid response format from AI' });
        }
    } catch (error) {
        console.error('Error generating gifts:', error);
        return res.status(500).json({
            error: 'Failed to generate gift suggestions',
            message: error.message,
            tip: "Check your Gemini API quota for gemini-2.5-flash-image"
        });
    }
}
