import { habitRepository } from '../repositories/habitRepository';
import { calculateStreaks } from './streakService';
import { HabitCreateInput, HabitUpdateInput, HabitWithStats, DashboardStats } from '../types/habit';
import { AppError } from '../middleware/errorHandler';

function toHabitWithStats(habit: any): HabitWithStats {
  const stats = calculateStreaks(habit);
  return {
    id: habit.id,
    name: habit.name,
    description: habit.description,
    category: habit.category,
    frequency: habit.frequency,
    customDays: habit.customDays,
    reminderTime: habit.reminderTime,
    startDate: habit.startDate,
    createdAt: habit.createdAt,
    updatedAt: habit.updatedAt,
    ...stats,
  };
}

export class HabitService {
  async getAll(): Promise<HabitWithStats[]> {
    const habits = await habitRepository.findAll();
    return habits.map(toHabitWithStats);
  }

  async getById(id: string): Promise<HabitWithStats> {
    const habit = await habitRepository.findById(id);
    if (!habit) throw new AppError(404, 'Habit not found');
    return toHabitWithStats(habit);
  }

  async create(data: HabitCreateInput): Promise<HabitWithStats> {
    const habit = await habitRepository.create(data);
    return toHabitWithStats(habit);
  }

  async update(id: string, data: HabitUpdateInput): Promise<HabitWithStats> {
    const habit = await habitRepository.update(id, data);
    return toHabitWithStats(habit);
  }

  async delete(id: string): Promise<void> {
    await habitRepository.delete(id);
  }

  async completeToday(id: string): Promise<HabitWithStats> {
    const habit = await habitRepository.findById(id);
    if (!habit) throw new AppError(404, 'Habit not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await habitRepository.findCompletion(id, today);
    if (existing) {
      return toHabitWithStats(habit);
    }

    await habitRepository.addCompletion(id, today);
    const updated = await habitRepository.findById(id);
    return toHabitWithStats(updated!);
  }

  async undoToday(id: string): Promise<HabitWithStats> {
    const habit = await habitRepository.findById(id);
    if (!habit) throw new AppError(404, 'Habit not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await habitRepository.removeCompletion(id, today);
    const updated = await habitRepository.findById(id);
    return toHabitWithStats(updated!);
  }
}

export const habitService = new HabitService();

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const habits = await habitService.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeHabits = habits.filter((h) => new Date(h.startDate) <= today).length;
    const completedToday = habits.filter((h) => h.completedToday).length;
    const pendingToday = activeHabits - completedToday;

    const totalScheduledCompletions = habits.reduce((sum, h) => {
      const start = new Date(h.startDate);
      start.setHours(0, 0, 0, 0);
      let count = 0;
      for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
        if (isScheduledForDay(h.frequency, h.customDays, d)) count++;
      }
      return sum + count;
    }, 0);

    const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);
    const overallCompletionRate = totalScheduledCompletions > 0 ? Math.round((totalCompletions / totalScheduledCompletions) * 100) : 0;

    const currentHighestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak)) : 0;
    const longestLifetimeStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.longestStreak)) : 0;

    return {
      totalHabits: habits.length,
      activeHabits,
      completedToday,
      pendingToday,
      overallCompletionRate,
      currentHighestStreak,
      longestLifetimeStreak,
    };
  }
}

export const dashboardService = new DashboardService();

function isScheduledForDay(frequency: string, customDays: number[], date: Date): boolean {
  const day = date.getDay();
  switch (frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return day >= 1 && day <= 5;
    case 'weekends':
      return day === 0 || day === 6;
    case 'weekly':
      return true;
    case 'custom':
      return customDays.includes(day);
    default:
      return true;
  }
}
