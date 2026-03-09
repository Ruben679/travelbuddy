import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function getSurpriseRecommendation(mood: string, budget: number) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest a travel destination in India for someone in a ${mood} mood with a budget of ₹${budget}. 
    Provide details for a flight, a hotel, and a local activity. 
    Format the response as JSON. Use Indian Rupees (₹) for all prices.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          description: { type: Type.STRING },
          flight: {
            type: Type.OBJECT,
            properties: {
              airline: { type: Type.STRING },
              price: { type: Type.NUMBER },
              duration: { type: Type.STRING }
            },
            required: ["airline", "price", "duration"]
          },
          hotel: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              pricePerNight: { type: Type.NUMBER },
              rating: { type: Type.NUMBER }
            },
            required: ["name", "pricePerNight", "rating"]
          },
          activity: { type: Type.STRING }
        },
        required: ["destination", "description", "flight", "hotel", "activity"]
      }
    }
  });

  return JSON.parse(response.text);
}
