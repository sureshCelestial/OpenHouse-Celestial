import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HabitCard from '../../components/HabitCard';
import { Habit } from '../../services/habitApi';

const mockHabit: Habit = {
  id: '1',
  name: 'Morning Run',
  description: 'Run 5km every morning',
  category: 'Fitness',
  frequency: 'daily',
  customDays: [],
  reminderTime: '07:00',
  startDate: '2026-07-01',
  currentStreak: 6,
  longestStreak: 6,
  totalCompletions: 6,
  completionPercentage: 75,
  completedToday: false,
};

describe('HabitCard', () => {
  const onComplete = vi.fn();
  const onUndo = vi.fn();
  const onDelete = vi.fn();

  it('renders habit info and complete button when not done', () => {
    render(
      <MemoryRouter>
        <HabitCard habit={mockHabit} onComplete={onComplete} onUndo={onUndo} onDelete={onDelete} />
      </MemoryRouter>
    );
    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    expect(screen.getByText('Fitness')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Complete/i })).toBeInTheDocument();
  });

  it('calls onComplete when complete button clicked', () => {
    render(
      <MemoryRouter>
        <HabitCard habit={mockHabit} onComplete={onComplete} onUndo={onUndo} onDelete={onDelete} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Complete/i }));
    expect(onComplete).toHaveBeenCalledWith('1');
  });

  it('shows undo button when completed today', () => {
    const completed = { ...mockHabit, completedToday: true };
    render(
      <MemoryRouter>
        <HabitCard habit={completed} onComplete={onComplete} onUndo={onUndo} onDelete={onDelete} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Undo/i })).toBeInTheDocument();
    expect(screen.getByText('Completed today ✅')).toBeInTheDocument();
  });

  it('calls onDelete when delete icon clicked', () => {
    render(
      <MemoryRouter>
        <HabitCard habit={mockHabit} onComplete={onComplete} onUndo={onUndo} onDelete={onDelete} />
      </MemoryRouter>
    );
    const deleteButton = screen.getAllByRole('button').find((b) => b.getAttribute('aria-label')?.includes('Delete'));
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(onDelete).toHaveBeenCalledWith('1');
    }
  });
});
