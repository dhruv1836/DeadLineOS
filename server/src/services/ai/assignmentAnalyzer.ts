import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const AssignmentSchema = z.object({
  title: z.string().describe("The title of the assignment."),
  subject: z.string().describe("The subject or course name."),
  deadline: z.string().describe("The deadline in ISO format if possible, or string."),
  type: z.string().describe("The type of assignment (e.g., Essay, Project, Exam, Reading)."),
  estimated_hours: z.number().describe("Estimated hours to complete the assignment."),
  difficulty: z.enum(["easy", "medium", "hard"]).describe("Estimated difficulty."),
  description: z.string().describe("A brief description or summary of the assignment requirements."),
  subtasks: z.array(z.string()).describe("A list of high-level subtasks to complete."),
});

export type AnalyzedAssignment = z.infer<typeof AssignmentSchema>;

/**
 * Analyzes raw text from an assignment document and returns structured metadata.
 * @param rawText The raw text extracted from the document.
 * @returns Structured assignment data.
 */
export async function analyzeAssignmentText(rawText: string): Promise<AnalyzedAssignment> {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert academic assistant. Your job is to extract assignment details from the provided raw text and output a structured JSON response.",
      },
      {
        role: "user",
        content: `Extract the assignment details from the following text:\n\n${rawText}`,
      },
    ],
    response_format: zodResponseFormat(AssignmentSchema, "assignment_details"),
  });

  const parsed = completion.choices[0].message.parsed;
  if (!parsed) {
    throw new Error("Failed to parse assignment details from AI response.");
  }

  return parsed;
}
