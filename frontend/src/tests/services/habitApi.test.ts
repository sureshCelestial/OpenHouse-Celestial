import { describe, it, expect, vi } from 'vitest';
import api from '../../services/api';
import * as habitApi from '../../services/habitApi';

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('habitApi service', () => {
  it('getHabits calls correct endpoint', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    (api.get as any).mockResolvedValue({ data: mockData });
    const result = await habitApi.getHabits();
    expect(api.get).toHaveBeenCalledWith('/habits');
    expect(result).toEqual(mockData);
  });

  it('getHabit calls correct endpoint with id', async () => {
    const mockData = { id: '1', name: 'Test' };
    (api.get as any).mockResolvedValue({ data: mockData });
    const result = await habitApi.getHabit('1');
    expect(api.get).toHaveBeenCalledWith('/habits/1');
    expect(result).toEqual(mockData);
  });

  it('createHabit calls correct endpoint with payload', async () => {
    const payload = { name: 'Run', category: 'Fitness', frequency: 'daily', reminderTime: '07:00', startDate: '2026-07-01' };
    const mockData = { id: '1', ...payload };
    (api.post as any).mockResolvedValue({ data: mockData });
    const result = await habitApi.createHabit(payload);
    expect(api.post).toHaveBeenCalledWith('/habits', payload);
    expect(result).toEqual(mockData);
  });

  it('updateHabit calls correct endpoint', async () => {
    const payload = { name: 'Run', category: 'Fitness', frequency: 'daily', reminderTime: '07:00', startDate: '2026-07-01' };
    const mockData = { id: '1', ...payload };
    (api.put as any).mockResolvedValue({ data: mockData });
    const result = await habitApi.updateHabit('1', payload);
    expect(api.put).toHaveBeenCalledWith('/habits/1', payload);
    expect(result).toEqual(mockData);
  });

  it('deleteHabit calls correct endpoint', async () => {
    (api.delete as any).mockResolvedValue({});
    await habitApi.deleteHabit('1');
    expect(api.delete).toHaveBeenCalledWith('/habits/1');
  });

  it('completeHabit calls correct endpoint', async () => {
    const mockData = { id: '1', completedToday: true };
    (api.post as any).mockResolvedValue({ data: mockData });
    const result = await habitApi.completeHabit('1');
    expect(api.post).toHaveBeenCalledWith('/habits/1/complete');
    expect(result).toEqual(mockData);
  });

  it('undoCompleteHabit calls correct endpoint', async () => {
    const mockData = { id: '1', completedToday: false };
    (api.delete as any).mockResolvedValue({ data: mockData });
    const result = await habitApi.undoCompleteHabit('1');
    expect(api.delete).toHaveBeenCalledWith('/habits/1/complete');
    expect(result).toEqual(mockData);
  });

  it('getDashboard calls correct endpoint', async () => {
    const mockData = { totalHabits: 5 };
    (api.get as any).mockResolvedValue({ data: mockData });
    const result = await habitApi.getDashboard();
    expect(api.get).toHaveBeenCalledWith('/dashboard');
    expect(result).toEqual(mockData);
  });
});
