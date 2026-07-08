import request from 'supertest';
import app from '../../src/app';
import { habitService, dashboardService } from '../../src/services/habitService';

jest.mock('../../src/services/habitService');

const mockedHabitService = habitService as jest.Mocked<typeof habitService>;
const mockedDashboardService = dashboardService as jest.Mocked<typeof dashboardService>;

describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/habits returns habits', async () => {
    mockedHabitService.getAll.mockResolvedValue([
      {
        id: '1', name: 'Run', category: 'Fitness', frequency: 'daily',
        customDays: [], reminderTime: '07:00', startDate: new Date('2024-01-01'),
        description: null, createdAt: new Date(), updatedAt: new Date(),
        currentStreak: 5, longestStreak: 10, totalCompletions: 20,
        completionPercentage: 80, completedToday: true,
      } as any,
    ]);
    const res = await request(app).get('/api/habits');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Run');
  });

  it('POST /api/habits creates habit', async () => {
    mockedHabitService.create.mockResolvedValue({
      id: '2', name: 'Read', category: 'Reading', frequency: 'daily',
      customDays: [], reminderTime: '20:00', startDate: new Date('2024-01-01'),
      description: null, createdAt: new Date(), updatedAt: new Date(),
      currentStreak: 0, longestStreak: 0, totalCompletions: 0,
      completionPercentage: 0, completedToday: false,
    } as any);
    const res = await request(app).post('/api/habits').send({
      name: 'Read', category: 'Reading', frequency: 'daily',
      reminderTime: '20:00', startDate: '2024-01-01',
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Read');
  });

  it('GET /api/dashboard returns stats', async () => {
    mockedDashboardService.getStats.mockResolvedValue({
      totalHabits: 3, activeHabits: 3, completedToday: 2,
      pendingToday: 1, overallCompletionRate: 75,
      currentHighestStreak: 12, longestLifetimeStreak: 30,
    });
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.totalHabits).toBe(3);
  });
});
