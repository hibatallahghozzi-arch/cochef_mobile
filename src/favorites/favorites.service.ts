import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  getMyFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { meal: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addFavorite(userId: string, mealId: string) {
    const meal = await this.prisma.meal.findUnique({ where: { id: mealId } });

    if (!meal) {
      throw new NotFoundException(`Meal ${mealId} not found`);
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_mealId: { userId, mealId } },
    });

    if (existing) {
      throw new ConflictException('Meal already in favorites');
    }

    return this.prisma.favorite.create({
      data: { userId, mealId },
    });
  }

  async removeFavorite(userId: string, mealId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_mealId: { userId, mealId } },
    });

    if (!existing) {
      throw new NotFoundException('Favorite not found');
    }

    return this.prisma.favorite.delete({
      where: { userId_mealId: { userId, mealId } },
    });
  }
}