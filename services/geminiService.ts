import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Initialize the client
// Note: The system prompt instructs to use process.env.API_KEY directly in the constructor
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizQuestions = async (topic: string = "General Knowledge"): Promise<Question[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Create a list of 3 multiple-choice questions about ${topic} suitable for a 10th-grade student. 
    The questions should be in Arabic.
    Provide 4 options for each question.
    Identify the correct answer index (0-3).
    Also provide a brief explanation of why the answer is correct.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const questions = JSON.parse(text) as Question[];
    return questions;

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions.");
  }
};

export interface TeacherQuizParams {
  subject: string;
  topic: string;
  grade: string;
  unit: string;
  type: 'mcq' | 'true_false';
}

export const generateTeacherQuiz = async (params: TeacherQuizParams): Promise<Question[]> => {
  try {
    const model = "gemini-2.5-flash";
    const questionCount = 5;
    
    let prompt = `Create a ${params.type === 'mcq' ? 'Multiple Choice' : 'True/False'} quiz.
    Subject: ${params.subject}
    Topic: ${params.topic}
    Unit: ${params.unit}
    Grade Level: ${params.grade}
    Language: Arabic.
    
    Generate ${questionCount} questions.
    For True/False questions, providing options ["صح", "خطأ"] (Correct answer 0 for True, 1 for False).
    For MCQ, provide 4 options.
    MUST include an 'explanation' field explaining the answer.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    return JSON.parse(text) as Question[];

  } catch (error) {
    console.error("Error generating teacher quiz:", error);
    throw new Error("Failed to generate quiz.");
  }
};
