import { z } from "zod";

export const inputSchema = z.object({
  text: z.string().optional()
});

export type InputSchema = z.infer<typeof inputSchema>;
