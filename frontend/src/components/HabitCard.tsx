import { Card, CardContent, Typography, Box, Chip, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import { useNavigate } from 'react-router-dom';
import { Habit } from '../services/habitApi';

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

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onUndo: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onComplete, onUndo, onDelete }: HabitCardProps) {
  const navigate = useNavigate();
  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" fontWeight={600} noWrap sx={{ maxWidth: '70%' }}>
            {habit.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => navigate(`/habits/${habit.id}/edit`)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(habit.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={habit.category} size="small" sx={{ bgcolor: (categoryColors[habit.category] || '#6366f1') + '18', color: categoryColors[habit.category] || '#6366f1', fontWeight: 600 }} />
          <Chip label={habit.frequency} size="small" variant="outlined" />
          <Chip label={habit.reminderTime} size="small" variant="outlined" />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700} color="primary">{habit.currentStreak}</Typography>
            <Typography variant="caption" color="text.secondary">Current Streak</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700} color="secondary">{habit.longestStreak}</Typography>
            <Typography variant="caption" color="text.secondary">Longest Streak</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight={700} color="success.main">{habit.completionPercentage}%</Typography>
            <Typography variant="caption" color="text.secondary">Completion</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {habit.completedToday ? 'Completed today ✅' : 'Pending today'}
          </Typography>
          {habit.completedToday ? (
            <Button variant="outlined" size="small" startIcon={<UndoIcon />} onClick={() => onUndo(habit.id)}>
              Undo
            </Button>
          ) : (
            <Button variant="contained" size="small" startIcon={<CheckCircleIcon />} onClick={() => onComplete(habit.id)}>
              Complete
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
