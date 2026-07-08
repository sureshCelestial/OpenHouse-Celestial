import { z } from 'zod';

export const FrequencyEnum = z.enum(['daily', 'weekdays', 'weekends', 'weekly', 'custom']);
export const CategoryEnum = z.enum(['Health', 'Fitness', 'Reading', 'Learning', 'Meditation', 'Productivity', 'Finance', 'Personal']);

export const habitCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: CategoryEnum,
  frequency: FrequencyEnum,
  customDays: z.array(z.number().min(0).max(6)).optional().default([]),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format, expected HH:MM'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
});

export const habitUpdateSchema = habitCreateSchema.partial();

export type HabitCreateInput = z.infer<typeof habitCreateSchema>;
export type HabitUpdateInput = z.infer<typeof habitUpdateSchema>;

export interface HabitWithStats {
  id: string;
  name: string;
  description: string | null;
  category: string;
  frequency: string;
  customDays: number[];
  reminderTime: string;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionPercentage: number;
  completedToday: boolean;
}

export interface DashboardStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  pendingToday: number;
  overallCompletionRate: number;
  currentHighestStreak: number;
  longestLifetimeStreak: number;
}
