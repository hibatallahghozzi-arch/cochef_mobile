import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

// Every menu query needs the same nested include (meal rows behind each
// menu_meals join row) — defined once so today/weekly/findOne can't drift
// out of sync with each other.
const WITH_MEALS = {
  meals: { include: { meal: true } },
} as const;

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

findToday() {
  const today = new Date();

  const utcStart = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    ),
  );

  const utcEnd = new Date(utcStart);
  utcEnd.setUTCDate(utcEnd.getUTCDate() + 1);

  console.log("UTC START:", utcStart);
  console.log("UTC END:", utcEnd);

  return this.prisma.menu.findFirst({
    where: {
      date: {
        gte: utcStart,
        lt: utcEnd,
      },
    },
    include: WITH_MEALS,
  });
}
  findWeekly() {
    const { start, end } = currentWeekRange();

    return this.prisma.menu.findMany({
      where: { date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
      include: WITH_MEALS,
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: WITH_MEALS,
    });

    if (!menu) {
      throw new NotFoundException(`Menu ${id} not found`);
    }

    return menu;
  }

  create(dto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: {
        date: new Date(dto.date),
        type: dto.type,
        // Nested write: creates one menu_meals row per id, in the same
        // INSERT transaction as the menu itself — if any mealId is invalid,
        // the whole create fails together rather than leaving a half-built menu.
        meals: {
          create: dto.mealIds.map((mealId) => ({ mealId })),
        },
      },
      include: WITH_MEALS,
    });
  }

  async update(id: string, dto: UpdateMenuDto) {
    await this.findOne(id); // throws 404 early if the menu doesn't exist

    // $transaction guarantees the "wipe old assignments, write new ones"
    // pair either both succeed or both roll back — never a menu left with
    // no meals because the second step failed.
    return this.prisma.$transaction(async (tx) => {
      if (dto.mealIds) {
        await tx.menuMeal.deleteMany({ where: { menuId: id } });
        await tx.menuMeal.createMany({
          data: dto.mealIds.map((mealId) => ({ menuId: id, mealId })),
        });
      }

      return tx.menu.update({
        where: { id },
        data: {
          ...(dto.date ? { date: new Date(dto.date) } : {}),
          ...(dto.type ? { type: dto.type } : {}),
        },
        include: WITH_MEALS,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Hard delete is fine here (unlike Meal's soft delete): a Menu is just a
    // dated grouping of meals, nothing else references menus.id as a
    // foreign key, and `onDelete: Cascade` on MenuMeal cleans up the join
    // rows automatically.
    return this.prisma.menu.delete({ where: { id } });
  }
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function currentWeekRange(): { start: Date; end: Date } {
  const today = startOfToday();
  const dayOfWeek = today.getDay(); // 0 = Sunday ... 6 = Saturday
  const daysSinceMonday = (dayOfWeek + 6) % 7;

  const start = new Date(today);
  start.setDate(today.getDate() - daysSinceMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}
