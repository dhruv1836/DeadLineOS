export interface AssignmentMetrics {
  id: string;
  title: string;
  dueDate: Date;
  estimatedHours: number;
  urgency: number; // 0-100
  workload: number; // 0-100
  difficulty: number; // 0-100
  conflictRisk: number; // 0-100
}

export type PriorityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface PriorityResult {
  score: number;
  level: PriorityLevel;
}

/**
 * Calculates the priority score and level for an assignment based on its metrics.
 * Formula: Priority = Urgency * 0.40 + Workload * 0.25 + Difficulty * 0.15 + ConflictRisk * 0.20
 * 
 * @param metrics The assignment metrics (each expected to be between 0 and 100)
 * @returns The calculated priority score (0-100) and discrete level
 */
export function calculatePriority(metrics: AssignmentMetrics): PriorityResult {
  // Ensure inputs are bounded 0-100
  const urgency = Math.min(100, Math.max(0, metrics.urgency));
  const workload = Math.min(100, Math.max(0, metrics.workload));
  const difficulty = Math.min(100, Math.max(0, metrics.difficulty));
  const conflictRisk = Math.min(100, Math.max(0, metrics.conflictRisk));

  // Calculate deterministic score
  const score = (urgency * 0.40) + (workload * 0.25) + (difficulty * 0.15) + (conflictRisk * 0.20);
  const roundedScore = Math.round(score * 10) / 10;

  // Determine priority level
  let level: PriorityLevel;
  if (roundedScore >= 80) {
    level = 'critical';
  } else if (roundedScore >= 60) {
    level = 'high';
  } else if (roundedScore >= 40) {
    level = 'moderate';
  } else {
    level = 'low';
  }

  return {
    score: roundedScore,
    level,
  };
}
