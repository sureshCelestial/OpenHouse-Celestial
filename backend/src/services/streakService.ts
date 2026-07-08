import { Habit, HabitCompletion } from '@prisma/client';

function toUtcMidnight(d: Date | string): Date {
  const date = typeof d === 'string' ? new Date(d) : new Date(d.getTime());
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function utcDay(date: Date): number {
  return date.getUTCDay();
}

function fmt(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
}

function isScheduled(frequency: string, customDays: number[], date: Date): boolean {
  const day = utcDay(date);
  switch (frequency) {
    case 'daily': return true;
    case 'weekdays': return day >= 1 && day <= 5;
    case 'weekends': return day === 0 || day === 6;
    case 'weekly': return true;
    case 'custom': return customDays.includes(day);
    default: return true;
  }
}

export function calculateStreaks(habit: Habit & { completions: HabitCompletion[] }, referenceDate: Date = new Date()) {
  const completions = habit.completions.map((c) => toUtcMidnight(c.completionDate));
  completions.sort((a, b) => a.getTime() - b.getTime());

  const today = toUtcMidnight(referenceDate);
  const startDate = toUtcMidnight(habit.startDate);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastScheduled: Date | null = null;

  const completionSet = new Set(completions.map(fmt));

  const allDates: Date[] = [];
  for (let d = new Date(startDate.getTime()); d.getTime() <= today.getTime(); d = addDay(d)) {
    allDates.push(new Date(d.getTime()));
  }

  for (const date of allDates) {
    if (!isScheduled(habit.frequency, habit.customDays, date)) continue;

    const completed = completionSet.has(fmt(date));
    if (completed) {
      tempStreak += 1;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
    lastScheduled = date;
  }

  if (lastScheduled) {
    currentStreak = completionSet.has(fmt(lastScheduled)) ? tempStreak : 0;
  }

  const totalCompletions = completions.length;
  const scheduledCount = allDates.filter((d) => isScheduled(habit.frequency, habit.customDays, d)).length;
  const completionPercentage = scheduledCount > 0 ? Math.round((totalCompletions / scheduledCount) * 100) : 0;

  const completedToday = completionSet.has(fmt(today)) && isScheduled(habit.frequency, habit.customDays, today);

  return { currentStreak, longestStreak, totalCompletions, completionPercentage, completedToday };
}
