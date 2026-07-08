import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/habitService';

export async function getDashboard(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (err) { next(err); }
}
