import api from './api';

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  category: string;
  frequency: string;
  customDays: number[];
  reminderTime: string;
  startDate: string;
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

export interface HabitInput {
  name: string;
  description?: string;
  category: string;
  frequency: string;
  customDays?: number[];
  reminderTime: string;
  startDate: string;
}

export const getHabits = () => api.get<Habit[]>('/habits').then((r) => r.data);
export const getHabit = (id: string) => api.get<Habit>(`/habits/${id}`).then((r) => r.data);
export const createHabit = (data: HabitInput) => api.post<Habit>('/habits', data).then((r) => r.data);
export const updateHabit = (id: string, data: HabitInput) => api.put<Habit>(`/habits/${id}`, data).then((r) => r.data);
export const deleteHabit = (id: string) => api.delete(`/habits/${id}`);
export const completeHabit = (id: string) => api.post<Habit>(`/habits/${id}/complete`).then((r) => r.data);
export const undoCompleteHabit = (id: string) => api.delete<Habit>(`/habits/${id}/complete`).then((r) => r.data);
export const getDashboard = () => api.get<DashboardStats>('/dashboard').then((r) => r.data);
