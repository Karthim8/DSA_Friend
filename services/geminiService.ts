
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeJavaCode = async (title: string, difficulty: string, code: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      You are a world-class DSA mentor. Analyze the following Java solution for the problem "${title}" (Difficulty: ${difficulty}).
      
      Java Code:
      \`\`\`java
      ${code}
      \`\`\`

      Provide:
      1. A simple English explanation (no jargon).
      2. The core algorithmic pattern (e.g., Sliding Window, BFS, DFS, Greedy, etc.).
      3. Time and Space complexity.
      4. Exactly 4 flashcards: "Core Logic", "Key Insight", "Reusable Code Template", and "Common Mistake".
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          pattern: { type: Type.STRING },
          timeComplexity: { type: Type.STRING },
          spaceComplexity: { type: Type.STRING },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["type", "content"]
            }
          }
        },
        required: ["explanation", "pattern", "timeComplexity", "spaceComplexity", "flashcards"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateQuiz = async (problems: any[]) => {
  const problemsSummary = problems.map(p => `- ${p.title} (${p.pattern})`).join('\n');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Based on the following solved DSA problems:
      ${problemsSummary}
      
      Generate 5 quiz questions:
      - 2 Pattern Recognition (Identify pattern used in specific problems)
      - 2 Logic Recall (Key algorithmic steps)
      - 1 Code Completion (Fill in a critical missing line)
      
      Problems context for questions:
      ${JSON.stringify(problems.map(p => ({ title: p.title, pattern: p.pattern, logic: p.explanation })))}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["type", "question", "options", "answer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
