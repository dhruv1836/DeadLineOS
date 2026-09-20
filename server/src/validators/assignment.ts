import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  subject: z.string().min(1, 'Subject is required').max(100),
  deadline: z.string().datetime({ message: 'Invalid datetime string' }),
  estimated_hours: z.number().positive('Estimated hours must be positive'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  description: z.string().optional(),
  source_file_path: z.string().max(500).optional(),
  assignment_type: z.enum(['homework', 'lab', 'project', 'quiz', 'presentation', 'report', 'other']).default('homework'),
  subtasks: z.array(z.object({ title: z.string().min(1), estimated_minutes: z.number().int().positive() })).optional(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
});

export const updateAssignmentSchema = createAssignmentSchema.partial().extend({
  status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  actual_hours: z.number().nonnegative().optional(),
});
