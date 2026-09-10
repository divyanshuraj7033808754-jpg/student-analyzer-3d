import { z } from 'zod';

export const subjectScoreSchema = z.object({
  subject: z.string().min(1, 'Subject name is required').max(30, 'Subject name too long'),
  score: z.number().min(0, 'Score cannot be negative').max(100, 'Score cannot exceed 100'),
});

export const studentInputSchema = z.object({
  name: z.string().min(1, 'Student name is required').max(60, 'Name too long'),
  subjects: z
    .array(subjectScoreSchema)
    .min(1, 'At least one subject is required')
    .max(8, 'Maximum 8 subjects allowed'),
  attendance: z.number().min(0).max(100),
  studyHours: z.number().min(0).max(24),
  extracurricular: z.number().min(0).max(10),
});

export type StudentInputParsed = z.infer<typeof studentInputSchema>;
