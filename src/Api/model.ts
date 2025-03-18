import { genAI } from "../Api/api";

type AIInput = string | File;

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
    } else if (input instanceof File) {
      requestPayload = await processFile(input);
    } else {
      throw new Error(
        "Invalid input type. Please provide text, audio, or an image."
      );
    }

    // ✅ Use a system prompt to make AI act naturally
    const systemPrompt = `
      You are a friendly and conversational AI assistant. Follow the conversation flow naturally. 
      - **Acknowledge** user intent before responding.
      - **Engage actively** instead of just rewording their message.
      - **Avoid repetition** and give fresh, natural responses.
      - **Provide helpful and clear answers** based on context.
      - **If the user greets you, greet them back warmly.**
      - **If they ask for coding help, respond accordingly.**
      - **If they mention math, guide them into solving equations.**
      - **Keep track of previous responses to maintain conversation flow.**
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

async function processFile(file: File): Promise<string> {
  if (!file) throw new Error("No file provided.");

  const allowedTypes = [
    "text/plain",
    "audio/mpeg",
    "audio/wav",
    "image/jpeg",
    "image/png",
    "image/webp"
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Unsupported file type. Please upload a text, audio, or image file."
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (file.type.startsWith("text/")) {
        resolve(reader.result as string);
      } else {
        resolve(`data:${file.type};base64,${btoa(reader.result as string)}`);
      }
    };

    reader.onerror = () => reject(new Error("Error reading the file."));

    if (file.type.startsWith("text/")) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
}

function handleAIError(error: unknown): string {
  if (error instanceof Error) {
    console.error("AI Error:", error.message);
    return error.message;
  }
  console.error("Unexpected Error:", error);
  return "An unexpected error occurred.";
}
