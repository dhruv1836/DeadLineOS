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
}

export interface SchedulerOutput {
  newBlocks: ScheduleBlock[];
  unallocatedAssignments: string[];
}

/**
 * Deterministic scheduling algorithm.
 * Allocates highest priority assignments first.
 * Respects user availability and avoids existing blocks.
 * Splits work into maximum 2-hour blocks.
 */
export function generateSchedule(input: SchedulerInput): SchedulerOutput {
  const { assignments, availability, existingBlocks } = input;
  
  // Sort assignments by priority score descending
  const sortedAssignments = [...assignments].sort((a, b) => b.priorityScore - a.priorityScore);
  
  // Sort availability slots by start time
  const availableSlots = [...availability].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  const newBlocks: ScheduleBlock[] = [];
  const unallocatedAssignments: string[] = [];
  const maxBlockDurationMs = 2 * 60 * 60 * 1000; // 2 hours

  // Helper to check if a proposed slot conflicts with existing blocks
  const isConflict = (start: Date, end: Date): boolean => {
    return existingBlocks.some(block => {
      const blockStart = new Date(block.startTime).getTime();
      const blockEnd = new Date(block.endTime).getTime();
      const s = start.getTime();
      const e = end.getTime();
      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      return s < blockEnd && e > blockStart;
    });
  };

  // State to track remaining hours per assignment
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
        // We want to schedule up to max 2 hours, or remaining hours, or remaining slot time
        const slotRemainingMs = endTime - currentTime;
        const workRemainingMs = hoursLeft * 60 * 60 * 1000;
        
        let proposedDurationMs = Math.min(maxBlockDurationMs, slotRemainingMs, workRemainingMs);
        let proposedEnd = currentTime + proposedDurationMs;
        
        // Ensure no conflict
        if (isConflict(new Date(currentTime), new Date(proposedEnd))) {
          // If conflict, advance time past the conflict (simplistic conflict resolution)
          const conflictingBlock = existingBlocks.find(b => {
             const bStart = new Date(b.startTime).getTime();
             const bEnd = new Date(b.endTime).getTime();
             return currentTime < bEnd && proposedEnd > bStart;
          });
          
          if (conflictingBlock) {
             currentTime = new Date(conflictingBlock.endTime).getTime();
          } else {
             // Fallback to push forward a bit if logic error
             currentTime += 15 * 60 * 1000; // 15 mins
          }
          continue;
        }

        if (proposedDurationMs > 0) {
          const newBlock: ScheduleBlock = {
            id: `block-${Math.random().toString(36).substring(7)}`,
            assignmentId: assignment.id,
            startTime: new Date(currentTime),
            endTime: new Date(proposedEnd),
            durationHours: proposedDurationMs / (60 * 60 * 1000)
          };
          
          newBlocks.push(newBlock);
          // Also add to existing blocks to prevent self-conflict in next iterations
          existingBlocks.push(newBlock); 
          
          hoursLeft -= newBlock.durationHours;
          currentTime = proposedEnd;
        } else {
          break; // Avoid infinite loops if something goes wrong
        }
      }
    }

    if (hoursLeft > 0) {
      unallocatedAssignments.push(assignment.id);
    }
  }

  return {
    newBlocks,
    unallocatedAssignments
  };
}
