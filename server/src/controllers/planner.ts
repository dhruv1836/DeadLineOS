import { Request, Response } from 'express';
import { calculatePriority, AssignmentMetrics } from '../algorithms/priorityEngine';
import { generateSchedule, SchedulerInput, ScheduleBlock } from '../algorithms/scheduler';
// Mock Supabase client for demonstration purposes. 
// In a real app, import from a configured utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const generatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assignments, availability, existingBlocks } = req.body as {
      assignments: AssignmentMetrics[],
      availability: any[],
      existingBlocks: ScheduleBlock[]
    };

    if (!assignments || !availability) {
      res.status(400).json({ error: 'Missing assignments or availability' });
      return;
    }

    // 1. Calculate priorities
    const prioritizedAssignments = assignments.map(assignment => {
      const priority = calculatePriority(assignment);
      return {
        ...assignment,
        priorityScore: priority.score,
        priorityLevel: priority.level
      };
    });

    // 2. Prepare scheduler input
    const input: SchedulerInput = {
      assignments: prioritizedAssignments,
      availability: availability.map(a => ({
        startTime: new Date(a.startTime),
        endTime: new Date(a.endTime)
      })),
      existingBlocks: existingBlocks ? existingBlocks.map(b => ({
        ...b,
        startTime: new Date(b.startTime),
        endTime: new Date(b.endTime)
      })) : []
    };

    // 3. Generate schedule
    const scheduleResult = generateSchedule(input);

    // 4. Save to Supabase (Mock)
    if (scheduleResult.newBlocks.length > 0) {
      const { error } = await supabase
        .from('schedule_blocks')
        .insert(scheduleResult.newBlocks);

      if (error) {
        console.error('Error saving blocks to Supabase:', error);
        res.status(500).json({ error: 'Failed to save schedule blocks' });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        prioritizedAssignments,
        newBlocks: scheduleResult.newBlocks,
        unallocatedAssignments: scheduleResult.unallocatedAssignments
      }
    });

  } catch (error: any) {
    console.error('Error in generatePlan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const replan = async (req: Request, res: Response): Promise<void> => {
  try {
    // Replanning might involve fetching existing state from DB and then running generatePlan logic
    // For now, we can reuse the generatePlan logic with updated state from client
    
    // Example: user modified existing blocks or added new assignments
    await generatePlan(req, res);
    
  } catch (error: any) {
    console.error('Error in replan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
