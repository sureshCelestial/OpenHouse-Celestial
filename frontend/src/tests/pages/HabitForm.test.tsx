import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HabitForm from '../../pages/HabitForm';
import * as habitApi from '../../services/habitApi';
import { vi } from 'vitest';

const mockHabit = {
  id: '1',
  name: 'Run',
  description: '5km',
  category: 'Fitness',
  frequency: 'daily',
  customDays: [],
  reminderTime: '07:00',
  startDate: '2026-07-01',
  currentStreak: 3,
  longestStreak: 3,
  totalCompletions: 3,
  completionPercentage: 50,
  completedToday: true,
};

describe('HabitForm', () => {
  beforeEach(() => {
    vi.spyOn(habitApi, 'getHabit').mockResolvedValue(mockHabit as any);
    vi.spyOn(habitApi, 'createHabit').mockResolvedValue(mockHabit as any);
    vi.spyOn(habitApi, 'updateHabit').mockResolvedValue(mockHabit as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders create form', () => {
    render(
      <MemoryRouter initialEntries={['/habits/new']}>
        <Routes>
          <Route path="/habits/new" element={<HabitForm />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Create Habit')).toBeInTheDocument();
    expect(screen.getByLabelText(/Habit Name/i)).toBeInTheDocument();
    expect(screen.getAllByRole('combobox').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByLabelText(/Reminder Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
  });

  it('shows validation error when name is empty', async () => {
    render(
      <MemoryRouter initialEntries={['/habits/new']}>
        <Routes>
          <Route path="/habits/new" element={<HabitForm />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Create/i }));
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('shows custom days when frequency is custom', () => {
    render(
      <MemoryRouter initialEntries={['/habits/new']}>
        <Routes>
          <Route path="/habits/new" element={<HabitForm />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    const customOption = screen.getByText('custom');
    fireEvent.click(customOption);
    expect(screen.getAllByText('Custom Days').length).toBeGreaterThan(0);
  });

  it('loads edit form with existing data', async () => {
    render(
      <MemoryRouter initialEntries={['/habits/1/edit']}>
        <Routes>
          <Route path="/habits/:id/edit" element={<HabitForm />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Edit Habit')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Run')).toBeInTheDocument();
  });
});
