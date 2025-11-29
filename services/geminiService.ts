import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const simplifyText = async (text: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following text to be simpler, clearer, and easier to read. 
      Use active voice. Keep short sentences. 
      Do not lose the original meaning. 
      Text: "${text}"`,
    });
    return response.text || "Could not generate simplified text.";
  } catch (error) {
    console.error("Gemini Simplify Error:", error);
    throw error;
  }
};

export const fixGrammar = async (text: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Correct the grammar and spelling of the following text. 
      Do not change the tone or style significantly, just fix errors.
      Text: "${text}"`,
    });
    return response.text || "Could not fix grammar.";
  } catch (error) {
    console.error("Gemini Grammar Error:", error);
    throw error;
  }
};
