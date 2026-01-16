import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the schema for structured output to ensure valid JSON generation
const resumeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personal_info: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        linkedin: { type: Type.STRING, nullable: true },
        github: { type: Type.STRING, nullable: true },
        portfolio: { type: Type.STRING, nullable: true },
        location: { type: Type.STRING, nullable: true }
      },
      required: ["name", "email", "phone"]
    },
    summary: { type: Type.STRING },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          major: { type: Type.STRING },
          institution: { type: Type.STRING },
          location: { type: Type.STRING },
          graduation_date: { type: Type.STRING },
          gpa: { type: Type.STRING, nullable: true },
          honors: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
          relevant_coursework: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true }
        },
        required: ["degree", "major", "institution", "location", "graduation_date"]
      }
    },
    technical_skills: {
      type: Type.OBJECT,
      properties: {
        languages: { type: Type.ARRAY, items: { type: Type.STRING } },
        frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
        databases: { type: Type.ARRAY, items: { type: Type.STRING } },
        cloud: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    work_experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          job_title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          dates: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["job_title", "company", "location", "dates", "bullets"]
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          associated_with: { type: Type.STRING, nullable: true },
          dates: { type: Type.STRING },
          link: { type: Type.STRING, nullable: true },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "dates", "bullets"]
      }
    },
    achievements: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  }
};

export const generateResumeWithAI = async (jobDescription: string): Promise<ResumeData> => {
  const ai = getAiClient();
  const prompt = `Generate a realistic, high-quality resume JSON for a candidate applying for the following role: "${jobDescription}". 
  Ensure the data is professional, uses strong action verbs, and fits the provided JSON schema perfectly. 
  Invent realistic details for name, contact, schools, and companies.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ResumeData;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
};

export const improveSummaryWithAI = async (currentSummary: string): Promise<string> => {
    const ai = getAiClient();
    const prompt = `Rewrite the following resume summary to be more impactful, professional, and concise. 
    Use strong action words and focus on value delivery. Return ONLY the new summary text string.
    
    Current Summary: "${currentSummary}"`;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
  
      return response.text || currentSummary;
    } catch (error) {
      console.error("Error improving summary:", error);
      throw error;
    }
  };
