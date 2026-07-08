import { prisma } from '../config/prisma';
import { HabitCreateInput, HabitUpdateInput } from '../types/habit';

export class HabitRepository {
  async findAll() {
    return prisma.habit.findMany({
      include: { completions: { orderBy: { completionDate: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.habit.findUnique({
      where: { id },
      include: { completions: { orderBy: { completionDate: 'asc' } } },
    });
  }

  async create(data: HabitCreateInput) {
    return prisma.habit.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
      },
      include: { completions: true },
    });
  }

  async update(id: string, data: HabitUpdateInput) {
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    return prisma.habit.update({
      where: { id },
      data: updateData,
      include: { completions: true },
    });
  }

  async delete(id: string) {
    return prisma.habit.delete({ where: { id } });
  }

  async addCompletion(habitId: string, date: Date) {
    return prisma.habitCompletion.create({
      data: { habitId, completionDate: date },
    });
  }

  async removeCompletion(habitId: string, date: Date) {
    return prisma.habitCompletion.deleteMany({
      where: { habitId, completionDate: date },
    });
  }

  async findCompletion(habitId: string, date: Date) {
    return prisma.habitCompletion.findUnique({
      where: {
        habitId_completionDate: { habitId, completionDate: date },
      },
    });
  }
}

export const habitRepository = new HabitRepository();
