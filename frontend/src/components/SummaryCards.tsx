import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { DashboardStats } from '../services/habitApi';

const cards: { label: string; key: keyof DashboardStats; color: string; suffix?: string }[] = [
  { label: 'Total Habits', key: 'totalHabits', color: '#6366f1' },
  { label: 'Completed Today', key: 'completedToday', color: '#22c55e' },
  { label: 'Active Streak', key: 'currentHighestStreak', color: '#f59e0b' },
  { label: 'Completion Rate', key: 'overallCompletionRate', color: '#8b5cf6', suffix: '%' },
];

export default function SummaryCards({ stats }: { stats: DashboardStats }) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((c) => (
        <Grid item xs={6} md={3} key={c.key}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {c.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: c.color }}>
                  {(stats as any)[c.key]}
                </Typography>
                {c.suffix && (
                  <Typography variant="body1" sx={{ color: c.color, fontWeight: 600 }}>
                    {c.suffix}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
