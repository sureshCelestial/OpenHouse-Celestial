import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Grid, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmptyState from '../components/EmptyState';
import SummaryCards from '../components/SummaryCards';
import HabitCard from '../components/HabitCard';
import { getHabits, getDashboard, deleteHabit, completeHabit, undoCompleteHabit, Habit, DashboardStats } from '../services/habitApi';

export default function Dashboard() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [h, s] = await Promise.all([getHabits(), getDashboard()]);
      setHabits(h);
      setStats(s);
    } catch (e: any) {
      setError(e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await deleteHabit(id);
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeHabit(id);
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to complete');
    }
  };

  const handleUndo = async (id: string) => {
    try {
      await undoCompleteHabit(id);
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to undo');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
  }

  if (habits.length === 0) {
    return <EmptyState />;
  }

  const motivation = stats && stats.completedToday === stats.activeHabits
    ? "Great work! You've completed all habits today. 🎉"
    : stats && stats.currentHighestStreak > 0
    ? `You're on a ${stats.currentHighestStreak}-day streak. Keep the momentum going! 🔥`
    : 'Start building your streak today. Every step counts. 💪';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/habits/new')}>
          New Habit
        </Button>
      </Box>

      {stats && <SummaryCards stats={stats} />}

      <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
        <Typography variant="body1" fontWeight={600} color="primary.dark">
          {motivation}
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Your Habits
      </Typography>

      <Grid container spacing={2}>
        {habits.map((h) => (
          <Grid item xs={12} md={6} key={h.id}>
            <HabitCard
              habit={h}
              onComplete={handleComplete}
              onUndo={handleUndo}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
