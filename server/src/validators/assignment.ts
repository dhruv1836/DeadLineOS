import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  subject: z.string().min(1, 'Subject is required').max(100),
  deadline: z.string().datetime({ message: 'Invalid datetime string' }),
  estimated_hours: z.number().positive('Estimated hours must be positive'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  description: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
});

export const updateAssignmentSchema = createAssignmentSchema.partial().extend({
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  actual_hours: z.number().nonnegative().optional(),
});
