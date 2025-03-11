import { genAI } from "../Api/api";
// Define input types
type AIInput = string | File;

export async function generateAIResponse(
  input: AIInput,
  modelName: string = "gemini-2.0-flash"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    // Validate input (text or file)
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

    // Call AI model
    const result = await model.generateContent(requestPayload);

    // Validate AI response
    if (!result?.response?.text) {
      throw new Error("Unexpected response format from AI.");
    }

    return result.response.text();
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

    // Convert text to string, images/audio to base64
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
