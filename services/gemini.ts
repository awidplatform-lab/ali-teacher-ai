import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// ==========================================
// BGHITI T-HARDCODER L-KEY? (Sahl walakin machi secure 100% f GitHub)
// Ktb l-key dialk hna bin "" (bhal: "AIzaSy...")
// Ila drtiha hna, l-Popup maghatbqach tl3.
const HARDCODED_KEY = ""; 
// ==========================================

// Helper to get key from storage, env, or hardcoded variable
export const getApiKey = (): string | null => {
  if (HARDCODED_KEY) return HARDCODED_KEY;
  return localStorage.getItem("gemini_api_key") || process.env.API_KEY || null;
};

// We create a function to generate schema based on language to ensure descriptions are accurate
const getAnalysisSchema = (targetLanguage: string): Schema => ({
  type: Type.OBJECT,
  properties: {
    detailedExplanation: {
      type: Type.STRING,
      description: `A comprehensive detailed explanation of the text's main ideas, context, and meaning in ${targetLanguage}. Explain it as if teaching a student.`,
    },
    translation: {
      type: Type.STRING,
      description: `The professional translation of the provided English text into ${targetLanguage}.`,
    },
    grammar: {
      type: Type.ARRAY,
      description: "A list of grammatical rules found in the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          rule: { type: Type.STRING, description: "Name of the grammar rule (e.g., Present Perfect, Passive Voice)." },
          explanation: { type: Type.STRING, description: `Explanation of how this rule is used in this specific context, written in ${targetLanguage}.` },
          exampleInText: { type: Type.STRING, description: "The specific snippet from the text illustrating this rule." },
        },
        required: ["rule", "explanation", "exampleInText"],
      },
    },
    vocabulary: {
      type: Type.ARRAY,
      description: "Key difficult vocabulary words found in the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "The English word." },
          type: { type: Type.STRING, description: "Part of speech (Verb, Noun, etc)." },
          meaning: { type: Type.STRING, description: `Meaning in ${targetLanguage}.` },
        },
        required: ["word", "type", "meaning"],
      },
    },
  },
  required: ["detailedExplanation", "translation", "grammar", "vocabulary"],
});

export const analyzeText = async (text: string, targetLanguage: string, file?: { mimeType: string; data: string }): Promise<AnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const parts: any[] = [];

    // Add file part if exists
    if (file) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType,
                data: file.data
            }
        });
    }

    // Add text prompt
    const promptText = `Analyze the provided content (text or image/document) for a university student. 
      ${text ? `Here is the user's note/text: "${text}"` : ""}
      
      If the content is an image or PDF, extract the English text first.

      OUTPUT LANGUAGE: You must write all explanations and translations in **${targetLanguage}**.

      1. **Detailed Explanation**: Explain the content, meaning, and context of the text in detail using ${targetLanguage}. Simplify complex ideas.
      2. **Translation**: Translate the text to clear ${targetLanguage}.
      3. **Grammar**: Identify key Grammar points used in this specific text and explain them in ${targetLanguage}.
      4. **Vocabulary**: Extract difficult Vocabulary and provide ${targetLanguage} meanings.
      `;
    
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts }, // Send as parts array
      config: {
        responseMimeType: "application/json",
        responseSchema: getAnalysisSchema(targetLanguage),
        systemInstruction: `You are 'Ali Teacher', an expert English Professor. You explain complex concepts simply in ${targetLanguage}. Your goal is deep understanding.`,
      },
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    const rawData = JSON.parse(response.text);
    
    const displayOriginal = text || "Content from uploaded file";

    return {
      originalText: displayOriginal,
      translation: rawData.translation,
      detailedExplanation: rawData.detailedExplanation,
      grammar: rawData.grammar,
      vocabulary: rawData.vocabulary,
      targetLanguage: targetLanguage
    };
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};

export const generateCoachResponse = async (history: {role: 'user'|'model', text: string}[], message: string, context?: string, targetLanguage: string = "Moroccan Darija"): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return "Error: API Key is missing. Please add it in settings.";
    
    const ai = new GoogleGenAI({ apiKey });

    try {
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: `You are 'Ali Teacher AI', a helpful English tutor. 
                Answer questions about the provided text or general English questions. 
                Use **${targetLanguage}** for all explanations to make it easy for the student to understand.
                Context of current lesson: ${context || "No text selected yet."}`,
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message });
        return result.text || "Thinking...";
    } catch (e) {
        console.error(e);
        return "Sorry, I'm having trouble connecting right now.";
    }
}
