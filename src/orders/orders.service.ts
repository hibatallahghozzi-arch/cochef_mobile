import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

const QR_PREFIX = 'COCHEF:ORDER:';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create a new order.
   *
   * The QR identifier is unique for this order.
   *
   * The actual QR displayed by the mobile app will contain:
   *
   * COCHEF:ORDER:<qrCode>
   */
  async create(
    userId: string,
    dto: CreateOrderDto,
  ) {
    // -----------------------------------------
    // Check user
    // -----------------------------------------

    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Authenticated user not found',
      );
    }

    // -----------------------------------------
    // Get real meal prices
    // -----------------------------------------

    const meals =
      await this.prisma.meal.findMany({
        where: {
          id: {
            in: dto.items.map(
              (item) => item.mealId,
            ),
          },
        },
      });

    // -----------------------------------------
    // Calculate total
    // -----------------------------------------

    const totalPrice = dto.items.reduce(
      (sum, item) => {
        const meal = meals.find(
          (meal) =>
            meal.id === item.mealId,
        );

        if (!meal) {
          throw new NotFoundException(
            `Meal ${item.mealId} not found`,
          );
        }

        return (
          sum +
          Number(meal.price) *
            item.quantity
        );
      },
      0,
    );

    // -----------------------------------------
    // Generate unique QR identifier
    // -----------------------------------------

    const qrCode = randomUUID();

    // -----------------------------------------
    // Create order
    // -----------------------------------------

    return this.prisma.order.create({
      data: {
        userId,

        paymentMethod:
          dto.paymentMethod,

        status: 'PENDING',

        totalPrice,

        qrCode,

        items: {
          create: dto.items.map(
            (item) => {
              const meal = meals.find(
                (meal) =>
                  meal.id === item.mealId,
              );

              return {
                mealId: item.mealId,
                quantity: item.quantity,
                unitPrice:
                  meal!.price,
              };
            },
          ),
        },
      },

      include: WITH_RELATIONS,
    });
  }

  /**
   * Get all orders belonging to
   * the authenticated villager.
   */
  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: WITH_RELATIONS,
    });
  }

  /**
   * Get one order belonging to
   * the authenticated villager.
   */
  async findOne(
    id: string,
    userId: string,
  ) {
    const order =
      await this.prisma.order.findFirst({
        where: {
          id,
          userId,
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

  /**
   * Scan an order QR code.
   *
   * Expected value:
   *
   * COCHEF:ORDER:<uuid>
   *
   * The backend extracts the UUID and
   * searches for the corresponding order.
   */
  async scanOrder(qrCode: string) {
    // -----------------------------------------
    // Validate prefix
    // -----------------------------------------

    if (!qrCode.startsWith(QR_PREFIX)) {
      throw new BadRequestException(
        'QR code CoChef invalide',
      );
    }

    // -----------------------------------------
    // Extract UUID
    // -----------------------------------------

    const orderQrCode =
      qrCode.substring(
        QR_PREFIX.length,
      );

    if (!orderQrCode) {
      throw new BadRequestException(
        'QR code de commande invalide',
      );
    }

    // -----------------------------------------
    // Find order
    //
    // We use findFirst because qrCode was
    // previously not marked @unique.
    // -----------------------------------------

    const order =
      await this.prisma.order.findFirst({
        where: {
          qrCode: orderQrCode,
        },

        include: WITH_RELATIONS,
      });

    if (!order) {
      throw new NotFoundException(
        'Commande introuvable',
      );
    }

    // -----------------------------------------
    // Prevent QR from being used twice
    // -----------------------------------------

    if (order.status === 'COLLECTED') {
      throw new BadRequestException(
        'Ce ticket a déjà été utilisé.',
      );
    }

    // -----------------------------------------
    // Prevent pickup before READY
    // -----------------------------------------

    if (order.status !== 'READY') {
      throw new BadRequestException(
        `La commande n'est pas encore prête. Statut actuel : ${order.status}`,
      );
    }

    // -----------------------------------------
    // Return order information to backoffice
    // -----------------------------------------

    return {
      id: order.id,

      orderNumber:
        order.orderNumber,

      status:
        order.status,

      paymentMethod:
        order.paymentMethod,

      totalPrice:
        order.totalPrice,

      qrCode:
        order.qrCode,

      declineReason:
        order.declineReason,

      createdAt:
        order.createdAt,

      updatedAt:
        order.updatedAt,

      user:
        order.user,

      items:
        order.items,
    };
  }

  /**
   * Update order status.
   *
   * Used by the manager/backoffice.
   */
  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ) {
    // -----------------------------------------
    // Check order
    // -----------------------------------------

    const order =
      await this.prisma.order.findUnique({
        where: {
          id,
        },
      });

    if (!order) {
      throw new NotFoundException(
        `Order ${id} not found`,
      );
    }

    // -----------------------------------------
    // Prevent changing an already collected
    // order
    // -----------------------------------------

    if (
      order.status === 'COLLECTED'
    ) {
      throw new BadRequestException(
        'Cette commande a déjà été récupérée.',
      );
    }

    // -----------------------------------------
    // Update status
    // -----------------------------------------

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