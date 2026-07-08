import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Button, TextField, MenuItem, Grid, Paper, Alert, FormControl,
  InputLabel, Select, FormHelperText, Chip, OutlinedInput, Checkbox, ListItemText,
} from '@mui/material';
import { getHabit, createHabit, updateHabit, HabitInput } from '../services/habitApi';

const categories = ['Health', 'Fitness', 'Reading', 'Learning', 'Meditation', 'Productivity', 'Finance', 'Personal'];
const frequencies = ['daily', 'weekdays', 'weekends', 'weekly', 'custom'];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function HabitForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [startDate, setStartDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      getHabit(id).then((h) => {
        setName(h.name);
        setDescription(h.description || '');
        setCategory(h.category);
        setFrequency(h.frequency);
        setCustomDays(h.customDays || []);
        setReminderTime(h.reminderTime);
        setStartDate(h.startDate.slice(0, 10));
      }).catch((e) => setError(e.message));
    } else {
      setStartDate(new Date().toISOString().slice(0, 10));
    }
  }, [id, isEdit]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    else if (name.length > 100) e.name = 'Max 100 characters';
    if (!category) e.category = 'Category is required';
    if (!frequency) e.frequency = 'Frequency is required';
    if (!reminderTime) e.reminderTime = 'Reminder time is required';
    if (!startDate) e.startDate = 'Start date is required';
    if (frequency === 'custom' && customDays.length === 0) e.customDays = 'Select at least one day';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    const payload: HabitInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      reminderTime,
      startDate,
      customDays: frequency === 'custom' ? customDays : undefined,
    };
    try {
      if (isEdit && id) {
        await updateHabit(id, payload);
      } else {
        await createHabit(payload);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {isEdit ? 'Edit Habit' : 'Create Habit'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Habit Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.frequency}>
              <InputLabel>Frequency</InputLabel>
              <Select value={frequency} label="Frequency" onChange={(e) => setFrequency(e.target.value)}>
                {frequencies.map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </Select>
              {errors.frequency && <FormHelperText>{errors.frequency}</FormHelperText>}
            </FormControl>
          </Grid>
          {frequency === 'custom' && (
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.customDays}>
                <InputLabel>Custom Days</InputLabel>
                <Select
                  multiple
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value as number[])}
                  input={<OutlinedInput label="Custom Days" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as number[]).map((v) => (
                        <Chip key={v} label={daysOfWeek[v]} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {daysOfWeek.map((day, idx) => (
                    <MenuItem key={day} value={idx}>
                      <Checkbox checked={customDays.includes(idx)} />
                      <ListItemText primary={day} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.customDays && <FormHelperText>{errors.customDays}</FormHelperText>}
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Reminder Time"
              type="time"
              fullWidth
              required
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              error={!!errors.reminderTime}
              helperText={errors.reminderTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
