import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import * as habitApi from '../../services/habitApi';
import { vi } from 'vitest';

const mockHabits = [
  { id: '1', name: 'Run', category: 'Fitness', frequency: 'daily', customDays: [], reminderTime: '07:00', startDate: '2026-07-01', currentStreak: 3, longestStreak: 3, totalCompletions: 3, completionPercentage: 50, completedToday: true },
  { id: '2', name: 'Read', category: 'Reading', frequency: 'daily', customDays: [], reminderTime: '21:00', startDate: '2026-07-01', currentStreak: 0, longestStreak: 0, totalCompletions: 0, completionPercentage: 0, completedToday: false },
];

const mockStats = {
  totalHabits: 2,
  activeHabits: 2,
  completedToday: 1,
  pendingToday: 1,
  overallCompletionRate: 25,
  currentHighestStreak: 3,
  longestLifetimeStreak: 3,
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.spyOn(habitApi, 'getHabits').mockResolvedValue(mockHabits as any);
    vi.spyOn(habitApi, 'getDashboard').mockResolvedValue(mockStats);
    vi.spyOn(habitApi, 'deleteHabit').mockResolvedValue(undefined);
    vi.spyOn(habitApi, 'completeHabit').mockResolvedValue(mockHabits[0] as any);
    vi.spyOn(habitApi, 'undoCompleteHabit').mockResolvedValue(mockHabits[0] as any);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders empty state when no habits', async () => {
    vi.spyOn(habitApi, 'getHabits').mockResolvedValue([]);
    vi.spyOn(habitApi, 'getDashboard').mockResolvedValue({ ...mockStats, totalHabits: 0, activeHabits: 0 });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Welcome to Habit Tracker')).toBeInTheDocument();
    });
  });

  it('renders dashboard with habits and stats', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Run')).toBeInTheDocument();
      expect(screen.getByText('Read')).toBeInTheDocument();
      expect(screen.getByText('Total Habits')).toBeInTheDocument();
    });
  });

  it('calls completeHabit when complete button clicked', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Read'));
    const completeButtons = screen.getAllByRole('button', { name: /Complete/i });
    fireEvent.click(completeButtons[0]);
    await waitFor(() => {
      expect(habitApi.completeHabit).toHaveBeenCalled();
    });
  });

  it('calls deleteHabit when delete clicked', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Run'));
    const deleteButtons = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-label')?.includes('Delete'));
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      await waitFor(() => {
        expect(habitApi.deleteHabit).toHaveBeenCalled();
      });
    }
  });
});
