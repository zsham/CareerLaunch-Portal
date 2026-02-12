
import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const enhanceJobDescription = async (title: string, rawDescription: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transform this basic job description into a professional, engaging job post for the position of "${title}". Keep it concise but professional.\n\nRaw Input: ${rawDescription}`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || rawDescription;
  } catch (error) {
    console.error("Gemini Error:", error);
    return rawDescription;
  }
};

export const getApplicationFeedback = async (job: Job, user: UserProfile): Promise<{ status: string; feedback: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as an HR Manager. Evaluate this application. 
      Job: ${job.title} - ${job.description}
      Applicant: ${user.name}, Skills: ${user.skills.join(", ")}, Bio: ${user.bio}
      
      Provide a decision (ACCEPTED or REJECTED) and a short professional reason.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, description: "Must be either 'ACCEPTED' or 'REJECTED'" },
            feedback: { type: Type.STRING, description: "Short feedback for the candidate" }
          },
          required: ["status", "feedback"]
        }
      }
    });
    return JSON.parse(response.text || '{"status":"PENDING", "feedback": "Evaluation pending."}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { status: "PENDING", feedback: "Our team is reviewing your application." };
  }
};
