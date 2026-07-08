import { Request, Response, NextFunction } from 'express';
import { habitService } from '../services/habitService';
import { habitCreateSchema, habitUpdateSchema } from '../types/habit';
import { validateBody } from '../middleware/validate';
import { AppError } from '../middleware/errorHandler';

export async function getHabits(_req: Request, res: Response, next: NextFunction) {
  try {
    const habits = await habitService.getAll();
    res.json(habits);
  } catch (err) { next(err); }
}

export async function getHabit(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitService.getById(req.params.id);
    res.json(habit);
  } catch (err) { next(err); }
}

export async function createHabit(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitService.create(req.body);
    res.status(201).json(habit);
  } catch (err) { next(err); }
}

export async function updateHabit(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitService.update(req.params.id, req.body);
    res.json(habit);
  } catch (err) { next(err); }
}

export async function deleteHabit(req: Request, res: Response, next: NextFunction) {
  try {
    await habitService.delete(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function completeHabit(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitService.completeToday(req.params.id);
    res.json(habit);
  } catch (err) { next(err); }
}

export async function undoCompleteHabit(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await habitService.undoToday(req.params.id);
    res.json(habit);
  } catch (err) { next(err); }
}

export const habitValidators = {
  create: validateBody(habitCreateSchema),
  update: validateBody(habitUpdateSchema),
};
