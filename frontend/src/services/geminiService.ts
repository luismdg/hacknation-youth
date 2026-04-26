// /src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface ProfileData {
  name: string;
  headline: string;
  location: string;
  language: string;
  experiences: Array<{
    name: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
}

export async function enhanceProfileWithAI(profile: ProfileData, userInput: string): Promise<Partial<ProfileData>> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      You are an AI assistant helping a young person in an emerging economy build their professional profile.
      
      Current profile:
      - Name: ${profile.name}
      - Headline: ${profile.headline}
      - Location: ${profile.location}
      - Experiences: ${profile.experiences.map(e => `${e.name} (${e.duration}): ${e.description}`).join("; ")}
      - Skills: ${profile.skills.join(", ")}
      
      User's additional input: "${userInput}"
      
      Based on this, please:
      1. Suggest a better headline (max 100 chars)
      2. Identify skills they might have but haven't listed (max 5)
      3. Suggest expanding any experience that's too brief
      4. Categorize their skills into: technical, soft, language
      
      Return ONLY valid JSON with this structure:
      {
        "suggestedHeadline": "string",
        "inferredSkills": ["skill1", "skill2"],
        "experienceToExpand": { "id": number, "expandedText": "string" } | null,
        "skillCategories": { "technical": [], "soft": [], "language": [] }
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {};
  } catch (error) {
    console.error("Gemini API error:", error);
    return {};
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
    });
    reader.readAsDataURL(audioBlob);
    const base64Audio = await base64Promise;
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: base64Audio
        }
      },
      { text: "Transcribe this audio accurately. Return only the transcribed text." }
    ]);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Transcription error:", error);
    return "";
  }
}

export async function enhanceWithVoiceInput(profile: ProfileData, transcribedText: string): Promise<{
  understoodIntent: string;
  suggestedUpdate: Partial<ProfileData>;
  clarificationNeeded?: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      User said: "${transcribedText}"
      
      Current profile: Name: ${profile.name}, Headline: ${profile.headline}
      Experiences: ${profile.experiences.length} entries
      Skills: ${profile.skills.join(", ")}
      
      Analyze what the user wants to update. They might be:
      - Adding a new experience
      - Updating their headline
      - Adding skills
      - Changing visibility settings
      - Asking for recommendations
      
      Return JSON:
      {
        "intent": "add_experience|update_headline|add_skills|get_recommendations|other",
        "extractedData": {
          "headline": "new headline if mentioned",
          "experienceName": "name of experience if mentioned",
          "experienceDuration": "duration if mentioned", 
          "experienceDescription": "description if mentioned",
          "skills": ["skill1", "skill2"] if mentioned
        },
        "response": "What to show the user",
        "needsClarification": false
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      understoodIntent: "other",
      suggestedUpdate: {},
    };
  } catch (error) {
    console.error("Voice enhancement error:", error);
    return {
      understoodIntent: "error",
      suggestedUpdate: {},
    };
  }
}