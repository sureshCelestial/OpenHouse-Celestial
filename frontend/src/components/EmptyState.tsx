import { Box, Button, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Welcome to Habit Tracker
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 480, mx: 'auto' }}>
        Build healthy routines, track your progress, and stay motivated with streaks and insights.
      </Typography>
      <Box sx={{ fontSize: 64, mb: 3 }}>🎯</Box>
      <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => navigate('/habits/new')}>
        Create Your First Habit
      </Button>
    </Paper>
  );
}
