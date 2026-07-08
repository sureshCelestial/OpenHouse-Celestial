import { jest } from '@jest/globals';
import { calculateStreaks } from '../../src/services/streakService';

function makeHabit(frequency: string, customDays: number[], completions: string[], startDateStr: string) {
  return {
    id: 'test-id',
    name: 'Test Habit',
    description: null,
    category: 'Health',
    frequency,
    customDays,
    reminderTime: '08:00',
    startDate: new Date(startDateStr),
    createdAt: new Date(),
    updatedAt: new Date(),
    completions: completions.map((d) => ({ id: 'c-' + d, habitId: 'test-id', completionDate: new Date(d), createdAt: new Date() })),
  };
}

describe('calculateStreaks', () => {
  it('returns zero for no completions', () => {
    const habit = makeHabit('daily', [], [], '2024-01-01');
    const ref = new Date('2024-01-01');
    const stats = calculateStreaks(habit, ref);
    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(0);
    expect(stats.totalCompletions).toBe(0);
    expect(stats.completionPercentage).toBe(0);
    expect(stats.completedToday).toBe(false);
  });

  it('calculates current streak for consecutive daily completions', () => {
    const habit = makeHabit('daily', [], ['2024-01-01', '2024-01-02', '2024-01-03'], '2024-01-01');
    const ref = new Date('2024-01-03');
    const stats = calculateStreaks(habit, ref);
    expect(stats.currentStreak).toBe(3);
    expect(stats.longestStreak).toBe(3);
    expect(stats.completedToday).toBe(true);
  });

  it('resets streak after missing a day', () => {
    const habit = makeHabit('daily', [], ['2024-01-01', '2024-01-02', '2024-01-04'], '2024-01-01');
    const ref = new Date('2024-01-04');
    const stats = calculateStreaks(habit, ref);
    expect(stats.currentStreak).toBe(1);
    expect(stats.longestStreak).toBe(2);
  });

  it('handles weekdays frequency correctly', () => {
    // Mon Jan 1, Tue Jan 2, Wed Jan 3, Thu Jan 4, Fri Jan 5, Sat Jan 6, Sun Jan 7
    const habit = makeHabit('weekdays', [], ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'], '2024-01-01');
    const ref = new Date('2024-01-05');
    const stats = calculateStreaks(habit, ref);
    expect(stats.currentStreak).toBe(5);
    expect(stats.longestStreak).toBe(5);
  });

  it('does not break streak over weekend for weekdays', () => {
    const habit = makeHabit('weekdays', [], ['2024-01-05', '2024-01-08'], '2024-01-01');
    const ref = new Date('2024-01-08');
    const stats = calculateStreaks(habit, ref);
    expect(stats.currentStreak).toBe(2);
  });

  it('handles custom days frequency', () => {
    // custom days: Monday(1), Wednesday(3), Friday(5)
    const habit = makeHabit('custom', [1, 3, 5], ['2024-01-01', '2024-01-03'], '2024-01-01');
    const ref = new Date('2024-01-03');
    const stats = calculateStreaks(habit, ref);
    expect(stats.currentStreak).toBe(2);
  });

  it('calculates completion percentage', () => {
    const habit = makeHabit('daily', [], ['2024-01-01', '2024-01-02'], '2024-01-01');
    const ref = new Date('2024-01-03');
    const stats = calculateStreaks(habit, ref);
    // 3 scheduled days, 2 completions -> 67%
    expect(stats.completionPercentage).toBe(67);
  });
});
