import { render, screen } from '@testing-library/react';
import SummaryCards from '../../components/SummaryCards';
import { DashboardStats } from '../../services/habitApi';

const mockStats: DashboardStats = {
  totalHabits: 8,
  activeHabits: 8,
  completedToday: 7,
  pendingToday: 1,
  overallCompletionRate: 35,
  currentHighestStreak: 8,
  longestLifetimeStreak: 8,
};

describe('SummaryCards', () => {
  it('renders all 4 summary cards with values', () => {
    render(<SummaryCards stats={mockStats} />);
    expect(screen.getByText('Total Habits')).toBeInTheDocument();
    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Active Streak')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.textContent === '35%')).toBeInTheDocument();
  });
});
