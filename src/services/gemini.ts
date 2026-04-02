import { GoogleGenAI, Type } from "@google/genai";
import { Trip, ItineraryItem } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

export interface GeneratedTripData {
  itinerary: ItineraryItem[];
  totalEstimatedPrice: number;
  budgetBreakdown: {
    activities: number;
    transport: number;
    food: number;
    shopping: number;
  };
  bookingUrl: string;
  weatherForecast: {
    temp: string;
    condition: string;
    description: string;
  };
  uniqueInsights?: {
    photographySpots: string[];
    culturalEtiquette: string[];
    localSecrets: string[];
  };
}

export async function generateItinerary(destination: string, days: number, interests: string[], budgetLevel: string = 'Standard'): Promise<GeneratedTripData> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("AI services are currently unavailable. Please check your connection.");
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Act as "The Efficiency Architect" and create a detailed ${days}-day travel itinerary for ${destination}. 
  Budget Level: ${budgetLevel}.
  Interests: ${interests.join(", ")}. 
  
  Focus strictly on minimizing "dead time" and transit logic. Prioritize "snack paths" (efficient routes with quick food stops) between attractions.
  
  For each activity, provide:
  - Specific name
  - Estimated time (e.g. "10:00 AM - 12:00 PM")
  - Estimated price in Indian Rupees (₹)
  - A Google Maps search query or URL
  - A direct ticket booking URL if available online
  - imageUrl: ALWAYS use "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400" (a professional travel flat lay with bag, camera, and pencil).
  - riskLevel: A number from 0 to 1 representing the probability of delay (e.g., 0.1 for low risk, 0.5 for high traffic/weather risk)
  - transitNote: A short note about the "snack path" or transit efficiency to the next spot.
  
  Also provide:
  - Total estimated price for the entire trip in Indian Rupees (₹). 
    CRITICAL: This must be an intelligent, realistic calculation including:
    1. All activity costs.
    2. Local transport (taxis, metro, etc.).
    3. An average daily shopping budget (₹2,000 - ₹5,000 depending on the location and budget level).
    4. Food and snacks (₹1,500 - ₹4,000 per day).
  - budgetBreakdown: A structured breakdown of the total estimated price into:
    - activities (sum of all activity prices)
    - transport (estimated local transit costs)
    - food (estimated daily food/snack costs)
    - shopping (estimated daily shopping budget)
  - A suggested transport booking URL
  - weatherForecast: Expected average temperature, condition (e.g. "Sunny", "Rainy"), and a brief description for the current season in ${destination}.
  - Unique Insights:
    - Best Photography Spots (3-5 spots)
    - Cultural Etiquette (3-5 tips)
    - Local Secrets (3-5 hidden gems)
  
  Return the response as a JSON object with 'itinerary', 'totalEstimatedPrice', 'budgetBreakdown', 'bookingUrl', 'weatherForecast', and 'uniqueInsights'.
  Each itinerary object should have 'day', 'activities' (array with 'name', 'time', 'price', 'locationUrl', 'ticketUrl', 'imageUrl', 'riskLevel', 'transitNote'), and 'notes'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        time: { type: Type.STRING },
                        price: { type: Type.NUMBER },
                        locationUrl: { type: Type.STRING },
                        ticketUrl: { type: Type.STRING },
                        imageUrl: { type: Type.STRING },
                        riskLevel: { type: Type.NUMBER },
                        transitNote: { type: Type.STRING }
                      },
                      required: ["name"]
                    }
                  },
                  notes: { type: Type.STRING }
                },
                required: ["day", "activities"]
              }
            },
            totalEstimatedPrice: { type: Type.NUMBER },
            budgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                activities: { type: Type.NUMBER },
                transport: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                shopping: { type: Type.NUMBER }
              },
              required: ["activities", "transport", "food", "shopping"]
            },
            bookingUrl: { type: Type.STRING },
            weatherForecast: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.STRING },
                condition: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["temp", "condition", "description"]
            },
            uniqueInsights: {
              type: Type.OBJECT,
              properties: {
                photographySpots: { type: Type.ARRAY, items: { type: Type.STRING } },
                culturalEtiquette: { type: Type.ARRAY, items: { type: Type.STRING } },
                localSecrets: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          required: ["itinerary", "totalEstimatedPrice", "budgetBreakdown", "bookingUrl", "weatherForecast"]
        },
        tools: []
      }
    });

    let text = response.text || "{}";
    // Sanitize JSON response (remove markdown code blocks if present)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}

export async function adaptItinerary(trip: Trip, delayDescription: string): Promise<GeneratedTripData> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("AI services are currently unavailable.");
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Act as "The Efficiency Architect". A traveler is experiencing a delay during their trip to ${trip.destination}.
  Delay Description: "${delayDescription}".
  
  Current Trip Context:
  - Title: ${trip.title}
  - Description: ${trip.description}
  - Itinerary: ${JSON.stringify(trip.itinerary)}
  
  Your Task:
  1. Analyze the delay and its impact on the remaining itinerary.
  2. Refine the plan to recover lost time or adjust activities intelligently.
  3. Prioritize high-value activities while maintaining transit efficiency.
  4. Recalculate the budget if necessary.
  
  Return a complete, updated trip data object in the same JSON format as the original itinerary generation, including 'itinerary', 'totalEstimatedPrice', 'budgetBreakdown', 'bookingUrl', 'weatherForecast', and 'uniqueInsights'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Reuse the same schema as generateItinerary
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        time: { type: Type.STRING },
                        price: { type: Type.NUMBER },
                        locationUrl: { type: Type.STRING },
                        ticketUrl: { type: Type.STRING },
                        imageUrl: { type: Type.STRING },
                        riskLevel: { type: Type.NUMBER },
                        transitNote: { type: Type.STRING }
                      },
                      required: ["name"]
                    }
                  },
                  notes: { type: Type.STRING }
                },
                required: ["day", "activities"]
              }
            },
            totalEstimatedPrice: { type: Type.NUMBER },
            budgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                activities: { type: Type.NUMBER },
                transport: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                shopping: { type: Type.NUMBER }
              },
              required: ["activities", "transport", "food", "shopping"]
            },
            bookingUrl: { type: Type.STRING },
            weatherForecast: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.STRING },
                condition: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["temp", "condition", "description"]
            },
            uniqueInsights: {
              type: Type.OBJECT,
              properties: {
                photographySpots: { type: Type.ARRAY, items: { type: Type.STRING } },
                culturalEtiquette: { type: Type.ARRAY, items: { type: Type.STRING } },
                localSecrets: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          required: ["itinerary", "totalEstimatedPrice", "budgetBreakdown", "bookingUrl", "weatherForecast"]
        }
      }
    });

    let text = response.text || "{}";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error adapting itinerary:", error);
    throw error;
  }
}

export async function generateTravelImage(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200";
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a single, highly specific Unsplash search keyword for a raw, authentic, professional travel photograph of ${prompt}. 
      The keyword should focus on realism, candid moments, and the specific atmosphere of the location. 
      Avoid generic terms. Return ONLY the keyword, no other text.`,
    });

    const keyword = response.text?.trim().replace(/ /g, "-") || prompt.replace(/ /g, "-");
    return `https://source.unsplash.com/featured/1600x900?${keyword},travel,authentic,candid`;
  } catch (error) {
    console.error("Error generating image keyword:", error);
    return `https://source.unsplash.com/featured/1600x900?${prompt.replace(/ /g, "-")},travel`;
  }
}

export async function generateJournalPrompt(trip: Trip): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) return "What was the highlight of your day?";
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Based on a trip to ${trip.destination} described as "${trip.description}", 
  suggest a creative and reflective journal prompt for today.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "What was the highlight of your day?";
  } catch (error) {
    console.error("Error generating journal prompt:", error);
    return "What was the highlight of your day?";
  }
}
