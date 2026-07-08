import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HabitDetails from '../../pages/HabitDetails';
import * as habitApi from '../../services/habitApi';
import { vi } from 'vitest';

const mockHabit = {
  id: '1',
  name: 'Morning Run',
  description: 'Run 5km',
  category: 'Fitness',
  frequency: 'daily',
  customDays: [],
  reminderTime: '07:00',
  startDate: '2026-07-01',
  currentStreak: 6,
  longestStreak: 6,
  totalCompletions: 6,
  completionPercentage: 75,
  completedToday: true,
};

describe('HabitDetails', () => {
  beforeEach(() => {
    vi.spyOn(habitApi, 'getHabit').mockResolvedValue(mockHabit as any);
    vi.spyOn(habitApi, 'deleteHabit').mockResolvedValue(undefined);
    vi.spyOn(habitApi, 'completeHabit').mockResolvedValue({ ...mockHabit, completedToday: true } as any);
    vi.spyOn(habitApi, 'undoCompleteHabit').mockResolvedValue({ ...mockHabit, completedToday: false } as any);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders habit details with stats', async () => {
    render(
      <MemoryRouter initialEntries={['/habits/1']}>
        <Routes>
          <Route path="/habits/:id" element={<HabitDetails />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Morning Run')).toBeInTheDocument();
    });
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
    expect(screen.getByText('Total Completions')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('shows undo button when completed today', async () => {
    render(
      <MemoryRouter initialEntries={['/habits/1']}>
        <Routes>
          <Route path="/habits/:id" element={<HabitDetails />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Undo Today/i })).toBeInTheDocument();
    });
  });

  it('calls deleteHabit when delete clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/habits/1']}>
        <Routes>
          <Route path="/habits/:id" element={<HabitDetails />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Morning Run'));
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    await waitFor(() => {
      expect(habitApi.deleteHabit).toHaveBeenCalledWith('1');
    });
  });
});
