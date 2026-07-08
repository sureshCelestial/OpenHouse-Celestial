import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Button, Paper, Grid, Chip, Alert, CircularProgress, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import { getHabit, deleteHabit, completeHabit, undoCompleteHabit, Habit } from '../services/habitApi';

const categoryColors: Record<string, string> = {
  Health: '#22c55e',
  Fitness: '#ef4444',
  Reading: '#3b82f6',
  Learning: '#8b5cf6',
  Meditation: '#ec4899',
  Productivity: '#f59e0b',
  Finance: '#10b981',
  Personal: '#6366f1',
};

export default function HabitDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getHabit(id)
      .then((h) => { setHabit(h); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id]);

  const handleDelete = async () => {
    if (!habit || !confirm('Delete this habit?')) return;
    try {
      await deleteHabit(habit.id);
      navigate('/');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleComplete = async () => {
    if (!habit) return;
    try {
      const updated = await completeHabit(habit.id);
      setHabit(updated);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleUndo = async () => {
    if (!habit) return;
    try {
      const updated = await undoCompleteHabit(habit.id);
      setHabit(updated);
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !habit) {
    return <Alert severity="error">{error || 'Habit not found'}</Alert>;
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Back
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>{habit.name}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/habits/${habit.id}/edit`)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <Chip label={habit.category} sx={{ bgcolor: (categoryColors[habit.category] || '#6366f1') + '18', color: categoryColors[habit.category] || '#6366f1', fontWeight: 600 }} />
        <Chip label={habit.frequency} variant="outlined" />
        <Chip label={`Reminder: ${habit.reminderTime}`} variant="outlined" />
        <Chip label={`Started: ${habit.startDate.slice(0, 10)}`} variant="outlined" />
      </Box>

      {habit.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {habit.description}
        </Typography>
      )}

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} color="primary">{habit.currentStreak}</Typography>
            <Typography variant="caption" color="text.secondary">Current Streak</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} color="secondary">{habit.longestStreak}</Typography>
            <Typography variant="caption" color="text.secondary">Longest Streak</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} color="success.main">{habit.totalCompletions}</Typography>
            <Typography variant="caption" color="text.secondary">Total Completions</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} color="warning.main">{habit.completionPercentage}%</Typography>
            <Typography variant="caption" color="text.secondary">Completion Rate</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {habit.completedToday ? (
          <Button variant="outlined" size="large" startIcon={<UndoIcon />} onClick={handleUndo}>
            Undo Today
          </Button>
        ) : (
          <Button variant="contained" size="large" startIcon={<CheckCircleIcon />} onClick={handleComplete}>
            Mark Complete
          </Button>
        )}
      </Box>
    </Paper>
  );
}
