import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const SubtaskSchema = z.object({
  title: z.string().describe("The title of the subtask."),
  estimated_minutes: z.number().describe("Estimated minutes to complete this subtask."),
});

const SubtaskBreakdownSchema = z.object({
  subtasks: z.array(SubtaskSchema).describe("A detailed breakdown of subtasks required to complete the assignment."),
});

export type SubtaskBreakdown = z.infer<typeof SubtaskBreakdownSchema>;
export type Subtask = z.infer<typeof SubtaskSchema>;

export interface AssignmentContext {
  title: string;
  description: string;
  estimated_hours: number;
}

/**
 * Generates a breakdown of subtasks with estimated minutes for an assignment.
 * @param context Context about the assignment including its description and overall estimated hours.
 * @returns A list of subtasks with time estimates.
 */
export async function generateSubtasks(context: AssignmentContext): Promise<SubtaskBreakdown> {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert productivity coach. Break down a given assignment into actionable subtasks with estimated times (in minutes).",
      },
      {
        role: "user",
        content: `Create a subtask breakdown for the following assignment:\n\n${JSON.stringify(context, null, 2)}`,
      },
    ],
    response_format: zodResponseFormat(SubtaskBreakdownSchema, "subtask_breakdown"),
  });

  const parsed = completion.choices[0].message.parsed;
  if (!parsed) {
    throw new Error("Failed to parse subtask breakdown from AI response.");
  }

  return parsed;
}
