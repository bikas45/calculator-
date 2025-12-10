import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const solveMathProblem = async (problem: string): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Using gemini-2.5-flash for speed and efficiency in math/logic tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: problem,
      config: {
        systemInstruction: `You are an expert mathematician and calculator assistant. 
        Your goal is to solve the user's math problem accurately and concisely.
        
        Rules:
        1. If the input is a direct calculation (e.g., "5 + 5"), simply provide the result.
        2. If the input is a word problem, briefly explain the steps and then provide the final answer clearly.
        3. Use Markdown for formatting (bold for final answers).
        4. Keep explanations purely mathematical and to the point.`,
        temperature: 0.2, // Low temperature for more deterministic math results
      }
    });

    return response.text || "I couldn't generate a solution. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the AI service. Please check your network or API key.");
  }
};
