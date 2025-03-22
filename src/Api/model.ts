import { genAI } from "../Api/api";

type AIInput = string | { base64: string; mimeType: string };

export async function generateAIResponse(
  input: AIInput,
  modelName: string = "gemini-2.0-flash"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    let inputParts: any[] = [];
    let requestPrompt: string = "";

    if (typeof input === "string") {
      if (!input.trim()) throw new Error("Text input cannot be empty.");
      requestPrompt = input;
    } else if (typeof input === "object" && input.base64) {
      inputParts.push({
        inlineData: {
          data: input.base64,
          mimeType: input.mimeType
        }
      });

      requestPrompt = `
        - Extract all text, numbers, and mathematical expressions from the image.
        - If there is a math equation, solve it **step by step** and provide the final answer.
        - If it contains both text and math, process them separately.
      `;
    } else {
      throw new Error("Invalid input type. Please provide text or an image.");
    }

    const systemPrompt = `
      You are an intelligent AI assistant. Follow these guidelines:
      - **Acknowledge user intent** before responding.
      - **Engage actively** instead of just rewording their message.
      - **Avoid repetition** and provide useful, natural responses.
      - **If given an image, extract the text, recognize equations, and assist accordingly.**
      - **For math problems, provide a structured step-by-step solution.**
      - **For text-based images, process and interpret the text meaningfully.**
      - **Adapt responses based on context (math, coding, general help, etc.).**
    `;

    const result = await model.generateContent([
      systemPrompt,
      requestPrompt,
      ...inputParts
    ]);

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
