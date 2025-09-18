
import { GoogleGenAI, Type } from "@google/genai";
import { Hobby, User, PersonalityType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateAvatar = async (hobbies: Hobby[]): Promise<string> => {
  if (!API_KEY) {
    // Return a placeholder if API key is not available
    return `https://picsum.photos/seed/${hobbies.map(h => h.name).join('')}/512`;
  }
  try {
    const hobbyNames = hobbies.map(h => h.name).slice(0, 3).join(', ');
    const prompt = `A vibrant, minimalist, abstract avatar representing ${hobbyNames}. Gen Z aesthetic, clean lines, glassmorphism style, with shiny blue and purple vibes. No text, no faces.`;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating avatar:", error);
    // Fallback to a placeholder on error
    return `https://picsum.photos/seed/${hobbies.map(h => h.name).join('')}/512`;
  }
};

export const generateIcebreakers = async (user1: User, user2: User): Promise<string[]> => {
  if (!API_KEY) {
    return ["Hey! What's up?", "Cool hobbies! Which one is your favorite?", "Hi! Nice to meet you."];
  }
  try {
    const sharedHobbies = user1.hobbies.filter(h1 => user2.hobbies.some(h2 => h2.id === h1.id));
    const prompt = `Generate 3 fun, quirky, and short icebreaker messages for two new friends who just matched on a friendship app called Frinzy. Do not include greetings like "Hey" or "Hi".
    
    User 1: Personality is ${user1.personalityType}, likes ${user1.hobbies.map(h => h.name).join(', ')}.
    User 2: Personality is ${user2.personalityType}, likes ${user2.hobbies.map(h => h.name).join(', ')}.
    Shared Hobbies: ${sharedHobbies.length > 0 ? sharedHobbies.map(h => h.name).join(', ') : 'None'}.
    
    Keep the tone very casual, friendly, and Gen Z style. The suggestions should be ready to send.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    icebreakers: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            }
        }
    });
    
    // FIX: Parse the JSON response from the model.
    // The response is now guaranteed to be a JSON string due to responseSchema.
    const jsonResponse = JSON.parse(response.text);
    const icebreakers = jsonResponse.icebreakers;
    
    return Array.isArray(icebreakers) && icebreakers.every(item => typeof item === 'string') ? icebreakers : [];
  } catch (error) {
    console.error("Error generating icebreakers:", error);
    return ["Hey! What's up?", "Love your vibe! What are you up to this weekend?", "We matched! What's your go-to comfort food?"];
  }
};
