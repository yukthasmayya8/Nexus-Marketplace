import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateProductDetails(query: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }] as any,
  });

  const prompt = `Find detailed information for a real product matching: "${query}". 
  Provide the following details in JSON format:
  {
    "name": "Full official product name",
    "description": "Detailed marketing description (approx 100 words)",
    "price": Recommended retail price in USD (number),
    "category": One of [Electronics, Fashion, Home & Living, Art, Sports, Wellness],
    "specifications": ["spec 1", "spec 2"]
  }
  Ensure the description is professional and alluring.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Extract JSON from the potential markdown response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("Failed to parse AI response");
}
