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
      3. "image_keyword" ska vara ett engelskt ord eller kort fras (1-2 ord) som bäst beskriver produkten för en bildsökning (t.ex. "leather notebook", "premium coffee").

      Svara ENDAST med ett giltigt JSON-objekt. Inget annat.
      Strukturen ska vara en array av objekt så här:
      [
        {
          "name": "Produktnamn",
          "description": "En kort säljande beskrivning (max 2 meningar)",
          "price": "Ungefärligt pris i SEK",
          "category": "Kategori",
          "image_keyword": "search term"
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

            // Add Unsplash image URLs as a fallback since Gemini Image Gen is restricted
            const suggestionsWithImages = suggestions.map(item => {
                const keyword = encodeURIComponent(item.image_keyword || item.name);
                return {
                    ...item,
                    // Use Unsplash Source for reliable professional product images
                    image_url: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop&sig=${Math.random()}`, // Default fallback
                    // Better approach: use a placeholder or try to match keyword if possible
                    // Since Unsplash Source is deprecated, we'll use a curated set or a search-based URL if available
                    // For now, let's use a high-quality product placeholder that varies by keyword
                    image_url: `https://loremflickr.com/800/800/${keyword}/all`
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
