import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const WorkloadEstimateSchema = z.object({
  estimated_hours: z.number().describe("Estimated total hours needed to complete the assignment."),
  rationale: z.string().describe("Explanation for the estimated hours based on complexity, type, and subject."),
});

export type WorkloadEstimate = z.infer<typeof WorkloadEstimateSchema>;

export interface AssignmentMetadata {
  title?: string;
  subject?: string;
  type?: string;
  difficulty?: string;
  description?: string;
}

/**
 * Estimates the hours required to complete an assignment based on its metadata.
 * @param metadata Assignment metadata.
 * @returns An estimate in hours with a rationale.
 */
export async function estimateWorkload(metadata: AssignmentMetadata): Promise<WorkloadEstimate> {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert time management assistant for students. Estimate the workload for a given assignment based on its metadata.",
      },
      {
        role: "user",
        content: `Estimate the workload for the following assignment:\n\n${JSON.stringify(metadata, null, 2)}`,
      },
    ],
    response_format: zodResponseFormat(WorkloadEstimateSchema, "workload_estimate"),
  });

  const parsed = completion.choices[0].message.parsed;
  if (!parsed) {
    throw new Error("Failed to parse workload estimate from AI response.");
  }

  return parsed;
}
