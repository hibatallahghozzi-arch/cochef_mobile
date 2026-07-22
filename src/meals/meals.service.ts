import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Villager-facing list: only meals a manager has marked active.
   * A meal a manager "deleted" is soft-deleted (isActive: false, see
   * `remove` below) precisely so it can still be excluded here without
   * breaking historical orders that reference it.
   */
  findAllActive() {
    return this.prisma.meal.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const meal = await this.prisma.meal.findUnique({ where: { id } });

    if (!meal) {
      throw new NotFoundException(`Meal ${id} not found`);
    }

    return meal;
  }

  create(dto: CreateMealDto) {
    return this.prisma.meal.create({ data: dto });
  }

  async update(id: string, dto: UpdateMealDto) {
    await this.findOne(id); // throws 404 early if the meal doesn't exist

    return this.prisma.meal.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * "Delete" is a soft delete (isActive = false), not a row deletion.
   * A hard DELETE would fail or silently corrupt history once an order
   * references this meal (order_items.meal_id is a foreign key) — and even
   * without that constraint, a manager retiring a dish shouldn't erase past
   * orders' record of what was actually purchased.
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.meal.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
