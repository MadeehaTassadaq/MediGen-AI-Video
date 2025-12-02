import { GoogleGenAI } from "@google/genai";
import { HospitalDetails } from "../types";

// Initialize the Gemini API client
// Note: API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketingScript = async (details: HospitalDetails): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a professional, warm, and trustworthy 30-45 second marketing script (approx 80-100 words) for a hospital promotional video.
      
      Here are the details:
      - Hospital Name: ${details.name}
      - Doctor/Head: ${details.doctorName}
      - Specialty: ${details.specialty}
      - Timings/Availability: ${details.timings}
      - Key Services: ${details.services}

      The script should be written for a voiceover narrator.
      Start with a welcoming hook.
      Mention the key services and specialty.
      End with a call to action.
      Do not include scene descriptions or camera directions, just the spoken text.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Welcome to our hospital. We provide excellent care.";
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate script. Please check your API key or try again.");
  }
};
