import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const WITH_RELATIONS = {
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  items: {
    include: {
      meal: true,
    },
  },
} as const;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateOrderDto) {
    // Get real meal prices from database
    // Never trust prices sent by the client
    const meals = await this.prisma.meal.findMany({
      where: {
        id: {
          in: dto.items.map((item) => item.mealId),
        },
      },
    });

    const totalPrice = dto.items.reduce((sum, item) => {
      const meal = meals.find(
        (meal) => meal.id === item.mealId,
      );

      if (!meal) {
        throw new NotFoundException(
          `Meal ${item.mealId} not found`,
        );
      }

      return sum + Number(meal.price) * item.quantity;
    }, 0);

    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        paymentMethod: dto.paymentMethod,
        totalPrice,
        qrCode: randomUUID(),

        items: {
          create: dto.items.map((item) => {
            const meal = meals.find(
              (meal) => meal.id === item.mealId,
            );

            return {
              mealId: item.mealId,
              quantity: item.quantity,
              unitPrice: meal!.price,
            };
          }),
        },
      },

      include: WITH_RELATIONS,
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: WITH_RELATIONS,
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },

      include: WITH_RELATIONS,
    });

    if (!order) {
      throw new NotFoundException(
        `Order ${id} not found`,
      );
    }

    return order;
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ) {
    // Check that order exists
    await this.findOne(id);

    return this.prisma.order.update({
      where: {
        id,
      },

      data: {
        status: dto.status,
      },

      include: WITH_RELATIONS,
    });
  }
}