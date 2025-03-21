import { genAI } from "../Api/api";

type AIInput = string | { url: string; type: string };

export async function generateAIResponse(
  input: AIInput,
  modelName: string = "gemini-2.0-flash"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    let requestPayload: string;

    if (typeof input === "string") {
      if (!input.trim()) throw new Error("Text input cannot be empty.");
      requestPayload = input;
    } else if (typeof input === "object" && input.url) {
      // ✅ Convert image input into a valid AI prompt
      requestPayload = `Here is an image: ${input.url}. Please analyze it and provide relevant information.`;
    } else {
      throw new Error("Invalid input type. Please provide text or an image.");
    }

    // ✅ Improved system prompt for AI behavior
    const systemPrompt = `
      You are an intelligent AI assistant. Follow these guidelines:
      - **Acknowledge user intent** before responding.
      - **Engage actively** instead of just rewording their message.
      - **Avoid repetition** and provide useful, natural responses.
      - **If given an image, describe its content and assist accordingly.**
      - **For text, provide clear, insightful, and structured responses.**
      - **Adapt responses based on context (math, coding, general help, etc.).**
    `;

    const result = await model.generateContent([systemPrompt, requestPayload]);

    if (!result?.response?.text) {
      throw new Error("Unexpected response format from AI.");
    }

    return result.response.text().trim();
  } catch (error) {
    return handleAIError(error);
  }
}

function handleAIError(error: unknown): string {
  console.error("AI Error:", error);
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}
