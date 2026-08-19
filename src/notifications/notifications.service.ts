import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all notifications belonging to one villager.
   * Newest notifications appear first.
   */
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get the number of unread notifications.
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      count,
    };
  }

  /**
   * Mark one notification as read.
   */
  async markAsRead(
    userId: string,
    notificationId: string,
  ) {
    const notification =
      await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    return this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Mark all notifications as read.
   */
  async markAllAsRead(userId: string) {
    const result =
      await this.prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

    return {
      updated: result.count,
    };
  }

  /**
   * Delete all notifications belonging to the current villager.
   */
  async deleteAll(userId: string) {
    const result =
      await this.prisma.notification.deleteMany({
        where: {
          userId,
        },
      });

    return {
      deleted: result.count,
    };
  }

  /**
   * Create a single notification.
   */
  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    orderId?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        orderId: data.orderId,
      },
    });
  }

  /**
   * Create a notification when an order changes status.
   */
  async createOrderNotification(
    userId: string,
    orderId: string,
    status: string,
  ) {
    const messages: Record<
      string,
      {
        title: string;
        message: string;
      }
    > = {
      PENDING: {
        title: 'Commande reçue',
        message:
          'Votre commande a bien été reçue par la cafétéria.',
      },

      CONFIRMED: {
        title: 'Commande confirmée',
        message:
          'Votre commande a été confirmée par la cafétéria.',
      },

      PREPARING: {
        title: 'Commande en préparation',
        message:
          'Votre repas est actuellement en préparation.',
      },

      READY: {
        title: 'Commande prête',
        message:
          'Votre commande est prête. Vous pouvez venir la récupérer.',
      },

      COLLECTED: {
        title: 'Commande récupérée',
        message:
          'Votre commande a été récupérée. Bon appétit !',
      },

      DECLINED: {
        title: 'Commande refusée',
        message:
          'Votre commande a été refusée par la cafétéria.',
      },
    };

    const notification = messages[status];

    if (!notification) {
      return null;
    }

    return this.createNotification({
      userId,
      orderId,
      type: NotificationType.ORDER,
      title: notification.title,
      message: notification.message,
    });
  }

  /**
   * Create an announcement or promotion
   * for one specific villager.
   */
  async createAdminNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: 'PROMOTION' | 'ANNOUNCEMENT';
  }) {
    return this.createNotification({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type:
        data.type === 'PROMOTION'
          ? NotificationType.PROMOTION
          : NotificationType.ANNOUNCEMENT,
    });
  }

  /**
   * Create an announcement or promotion
   * for one villager or all villagers.
   *
   * If userId is provided:
   * → notification goes only to that villager.
   *
   * If userId is omitted:
   * → notification goes to every VILLAGER.
   */
  async createAdminNotificationForUsers(data: {
    title: string;
    message: string;
    type: 'PROMOTION' | 'ANNOUNCEMENT';
    userId?: string;
  }) {
    /**
     * Send to one specific villager.
     */
    if (data.userId) {
      const notification =
        await this.createAdminNotification({
          userId: data.userId,
          title: data.title,
          message: data.message,
          type: data.type,
        });

      return {
        sent: 1,
        notifications: [notification],
      };
    }

    /**
     * Send to every villager.
     */
    const users = await this.prisma.user.findMany({
      where: {
        role: 'VILLAGER',
      },
      select: {
        id: true,
      },
    });

    if (users.length === 0) {
      return {
        sent: 0,
        notifications: [],
      };
    }

    const notifications =
      await this.prisma.$transaction(
        users.map((user) =>
          this.prisma.notification.create({
            data: {
              userId: user.id,
              title: data.title,
              message: data.message,
              type:
                data.type === 'PROMOTION'
                  ? NotificationType.PROMOTION
                  : NotificationType.ANNOUNCEMENT,
            },
          }),
        ),
      );

    return {
      sent: notifications.length,
      notifications,
    };
  }
}