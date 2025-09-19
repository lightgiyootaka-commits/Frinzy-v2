// Fix: Implementing Gemini API services for avatar and icebreaker generation.
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { User, Hobby } from '../types';

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
// This variable is assumed to be pre-configured in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates an avatar image based on user hobbies.
 * @param hobbies - An array of user hobbies.
 * @returns A base64 encoded string of the generated image.
 */
export const generateAvatar = async (hobbies: Hobby[]): Promise<string> => {
    const hobbyNames = hobbies.map(h => h.name).join(', ');
    const prompt = `minimalist, abstract, vibrant, vector art logo for a profile avatar. The design should subtly represent the themes of ${hobbyNames}. Clean background, modern, simple shapes, digital art.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating avatar with Gemini:", error);
        // Fallback to a pravatar image on error
        return `https://i.pravatar.cc/300?u=error_${Date.now()}`;
    }
};

/**
 * Generates icebreaker suggestions for a chat between two users.
 * @param user1 - The first user.
 * @param user2 - The second user.
 * @returns An array of icebreaker strings.
 */
export const generateIcebreakers = async (user1: User, user2: User): Promise<string[]> => {
    const user1Hobbies = user1.hobbies.map(h => h.name).join(', ');
    const user2Hobbies = user2.hobbies.map(h => h.name).join(', ');

    const prompt = `
        Based on the profiles of two people, create three short, engaging icebreaker questions (less than 15 words each).
        The goal is to find common ground or interesting differences. Do not use emojis.

        Person 1 Hobbies: ${user1Hobbies}
        Person 1 Bio: ${user1.bio}
        Person 1 Personality: ${user1.personalityType}

        Person 2 Hobbies: ${user2Hobbies}
        Person 2 Bio: ${user2.bio}
        Person 2 Personality: ${user2.personalityType}
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: "A short, engaging icebreaker question."
                    }
                }
            },
        });
        
        const jsonStr = response.text.trim();
        const suggestions = JSON.parse(jsonStr);
        
        if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
            return suggestions.slice(0, 3);
        } else {
            throw new Error("Invalid format for icebreakers");
        }
    } catch (error) {
        console.error("Error generating icebreakers:", error);
        // Fallback suggestions
        return ["What's the most interesting thing you've done recently?", "If you could travel anywhere, where would you go?", "What's a hobby you've always wanted to try?"];
    }
};
