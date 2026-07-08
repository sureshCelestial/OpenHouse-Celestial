import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';

describe('EmptyState', () => {
  it('renders welcome message and CTA', () => {
    render(
      <MemoryRouter>
        <EmptyState />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome to Habit Tracker')).toBeInTheDocument();
    expect(screen.getByText(/Build healthy routines/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Your First Habit/i })).toBeInTheDocument();
  });
});
