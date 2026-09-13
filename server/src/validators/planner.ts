import { z } from 'zod';
import { createAssignmentSchema } from './assignment.js';

export const generatePlanSchema = z.object({
  assignments: z.array(createAssignmentSchema.extend({
    id: z.string().uuid().optional(),
  })).min(1, 'At least one assignment is required to generate a plan'),
  startDate: z.string().datetime({ message: 'Invalid start datetime string' }),
  endDate: z.string().datetime({ message: 'Invalid end datetime string' }),
  preferences: z.object({
    maxHoursPerDay: z.number().positive().max(24).default(8),
    preferredStudyTime: z.enum(['morning', 'afternoon', 'evening', 'night']).default('afternoon'),
  }).optional(),
});
