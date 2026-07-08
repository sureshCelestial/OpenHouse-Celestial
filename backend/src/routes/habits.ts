import { Router } from 'express';
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  undoCompleteHabit,
  habitValidators,
} from '../controllers/habitsController';

const router = Router();

router.get('/', getHabits);
router.post('/', habitValidators.create, createHabit);
router.get('/:id', getHabit);
router.put('/:id', habitValidators.update, updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/complete', completeHabit);
router.delete('/:id/complete', undoCompleteHabit);

export default router;
