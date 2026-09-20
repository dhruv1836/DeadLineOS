import { AssignmentMetrics } from './priorityEngine';

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

export interface ScheduleBlock {
  id: string;
  assignmentId: string;
  startTime: Date;
  endTime: Date;
  durationHours: number;
}

export interface SchedulerInput {
  assignments: (AssignmentMetrics & { priorityScore: number })[];
  availability: TimeSlot[];
  existingBlocks: ScheduleBlock[];
  maxDailyStudyHours?: number; // Default 6 hours
  pacingBreakMinutes?: number; // Default 15 mins
}

export interface SchedulerOutput {
  newBlocks: ScheduleBlock[];
  unallocatedAssignments: string[];
}

/**
 * Deterministic scheduling algorithm.
 * - Allocates highest priority assignments first.
 * - Respects user availability and avoids existing blocks.
 * - Caps blocks to max 2 hours.
 * - Enforces strict daily cognitive load cap (max 6 hours/day).
 * - Enforces 15-minute pacing buffer between study blocks.
 */
export function generateSchedule(input: SchedulerInput): SchedulerOutput {
  const { assignments, availability, existingBlocks } = input;
  const maxDailyMs = (input.maxDailyStudyHours ?? 6) * 60 * 60 * 1000;
  const pacingBreakMs = (input.pacingBreakMinutes ?? 15) * 60 * 1000;
  const maxBlockDurationMs = 2 * 60 * 60 * 1000; // 2 hours max per block
  
  const sortedAssignments = [...assignments].sort((a, b) => b.priorityScore - a.priorityScore);
  const availableSlots = [...availability].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  const newBlocks: ScheduleBlock[] = [];
  const unallocatedAssignments: string[] = [];

  // Track daily scheduled load to prevent cramming
  const dailyScheduledMs = new Map<string, number>();
  const getDayKey = (d: Date) => d.toISOString().slice(0, 10);

  existingBlocks.forEach(b => {
    const key = getDayKey(new Date(b.startTime));
    const dur = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
    dailyScheduledMs.set(key, (dailyScheduledMs.get(key) || 0) + dur);
  });

  const isConflict = (start: Date, end: Date): boolean => {
    return existingBlocks.some(block => {
      const blockStart = new Date(block.startTime).getTime();
      const blockEnd = new Date(block.endTime).getTime();
      return start.getTime() < blockEnd && end.getTime() > blockStart;
    });
  };

  const remainingHours = new Map<string, number>();
  sortedAssignments.forEach(a => remainingHours.set(a.id, a.estimatedHours));

  for (const assignment of sortedAssignments) {
    let hoursLeft = remainingHours.get(assignment.id) || 0;
    if (hoursLeft <= 0) continue;

    for (let slotIndex = 0; slotIndex < availableSlots.length && hoursLeft > 0; slotIndex++) {
      const slot = availableSlots[slotIndex];
      let currentTime = slot.startTime.getTime();
      const endTime = slot.endTime.getTime();

      while (currentTime < endTime && hoursLeft > 0) {
        const dayKey = getDayKey(new Date(currentTime));
        const currentDayLoad = dailyScheduledMs.get(dayKey) || 0;
        const availableDailyMs = Math.max(0, maxDailyMs - currentDayLoad);

        // If today's cognitive load cap is reached, jump to next slot
        if (availableDailyMs <= 0) break;

        const slotRemainingMs = endTime - currentTime;
        const workRemainingMs = hoursLeft * 60 * 60 * 1000;
        
        let proposedDurationMs = Math.min(maxBlockDurationMs, slotRemainingMs, workRemainingMs, availableDailyMs);
        let proposedEnd = currentTime + proposedDurationMs;
        
        if (isConflict(new Date(currentTime), new Date(proposedEnd))) {
          const conflictingBlock = existingBlocks.find(b => {
             const bStart = new Date(b.startTime).getTime();
             const bEnd = new Date(b.endTime).getTime();
             return currentTime < bEnd && proposedEnd > bStart;
          });
          
          currentTime = conflictingBlock ? new Date(conflictingBlock.endTime).getTime() + pacingBreakMs : currentTime + 15 * 60 * 1000;
          continue;
        }

        if (proposedDurationMs >= 15 * 60 * 1000) { // minimum 15 min session
          const newBlock: ScheduleBlock = {
            id: `block-${Math.random().toString(36).substring(7)}`,
            assignmentId: assignment.id,
            startTime: new Date(currentTime),
            endTime: new Date(proposedEnd),
            durationHours: Math.round((proposedDurationMs / (60 * 60 * 1000)) * 100) / 100
          };
          
          newBlocks.push(newBlock);
          existingBlocks.push(newBlock);
          dailyScheduledMs.set(dayKey, currentDayLoad + proposedDurationMs);
          
          hoursLeft -= newBlock.durationHours;
          // Pacing break between study sessions
          currentTime = proposedEnd + pacingBreakMs;
        } else {
          break;
        }
      }
    }

    if (hoursLeft > 0.1) {
      unallocatedAssignments.push(assignment.id);
    }
  }

  return { newBlocks, unallocatedAssignments };
}