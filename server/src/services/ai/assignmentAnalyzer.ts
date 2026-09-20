import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const AssignmentSchema = z.object({
  title: z.string(), subject: z.string(), deadline: z.string().nullable(),
  assignment_type: z.enum(['homework', 'lab', 'project', 'quiz', 'presentation', 'report', 'other']),
  estimated_hours: z.number().positive(), difficulty: z.enum(['easy', 'medium', 'hard']),
  description: z.string(), subtasks: z.array(z.object({ title: z.string(), estimated_minutes: z.number().int().positive() })),
  important_instructions: z.array(z.string()), workload_rationale: z.string(),
});

const getOpenAI = () => process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export type AnalyzedAssignment = z.infer<typeof AssignmentSchema>;

/**
 * Analyzes raw text from an assignment document and returns structured metadata.
 * @param rawText The raw text extracted from the document.
 * @returns Structured assignment data.
 */
export async function analyzeAssignmentText(rawText: string): Promise<AnalyzedAssignment> {
  const openai = getOpenAI();
  if (!openai) return fallbackAnalysis(rawText);
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert academic assistant. Your job is to extract assignment details from the provided raw text and output a structured JSON response.",
      },
      {
        role: "user",
        content: `Extract all assignment details, requirements, rubric instructions, dates, and actionable subtasks from the following text. Return null for an unknown deadline.\n\n${rawText.slice(0, 50000)}`,
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

function fallbackAnalysis(rawText: string): AnalyzedAssignment {
  const text = rawText.replace(/\s+/g, ' ').trim();
  const deadlineMatch = text.match(/(?:due|deadline|submit(?:ted)? by)\s*[:\-]?\s*([A-Z][a-z]+\s+\d{1,2}(?:,\s*\d{4})?|\d{4}-\d{2}-\d{2})/i);
  const hoursMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);
  const title = text.split(/[.!?]/)[0]?.slice(0, 120) || 'Uploaded assignment';
  const subtasks = text.split(/(?:\.|;|\n)/).map(line => line.trim()).filter(line => line.length > 20).slice(0, 8).map(line => ({ title: line.slice(0, 160), estimated_minutes: 30 }));
  return { title, subject: 'General', deadline: deadlineMatch?.[1] || null, assignment_type: /essay|paper|report/i.test(text) ? 'report' : /project/i.test(text) ? 'project' : 'homework', estimated_hours: Number(hoursMatch?.[1] || Math.max(1, subtasks.length * 0.5)), difficulty: /advanced|complex|研究|rubric/i.test(text) ? 'hard' : 'medium', description: text.slice(0, 1000), subtasks, important_instructions: [], workload_rationale: 'Estimated from the uploaded document text.' };
}
