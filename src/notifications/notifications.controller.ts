import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * =========================================================
   * VILLAGER NOTIFICATIONS
   * =========================================================
   */

  /**
   * GET /api/v1/notifications
   *
   * Get notifications for the authenticated user.
   */
  @Get()
  async getNotifications(@Req() req: any) {
    return this.notificationsService.getUserNotifications(
      req.user.id,
    );
  }

  /**
   * GET /api/v1/notifications/unread-count
   *
   * Get unread notification count.
   */
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(
      req.user.id,
    );
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   *
   * Mark one notification as read.
   */
  @Patch(':id/read')
  async markAsRead(
    @Req() req: any,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(
      req.user.id,
      notificationId,
    );
  }

  /**
   * PATCH /api/v1/notifications/read-all
   *
   * Mark all notifications as read.
   */
  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(
      req.user.id,
    );
  }

  /**
   * DELETE /api/v1/notifications
   *
   * Delete all notifications for the authenticated user.
   */
  @Delete()
  async deleteAll(@Req() req: any) {
    return this.notificationsService.deleteAll(
      req.user.id,
    );
  }

  /**
   * =========================================================
   * BACKOFFICE NOTIFICATIONS
   * =========================================================
   */

  /**
   * POST /api/v1/notifications/admin
   *
   * Send a promotion or announcement.
   *
   * ADMIN and MANAGER only.
   *
   * Without userId:
   *   → sends to every VILLAGER.
   *
   * With userId:
   *   → sends only to that villager.
   *
   * Example:
   *
   * {
   *   "title": "Promotion du jour 🎉",
   *   "message": "Profitez de notre promotion aujourd'hui !",
   *   "type": "PROMOTION"
   * }
   *
   * Or:
   *
   * {
   *   "title": "Information importante",
   *   "message": "La cafétéria fermera exceptionnellement à 16h.",
   *   "type": "ANNOUNCEMENT",
   *   "userId": "USER_ID"
   * }
   */
  @Post('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async createAdminNotification(
    @Body()
    body: {
      title: string;
      message: string;
      type: 'PROMOTION' | 'ANNOUNCEMENT';
      userId?: string;
    },
  ) {
    return this.notificationsService.createAdminNotificationForUsers(
      {
        title: body.title?.trim(),
        message: body.message?.trim(),
        type: body.type,
        userId: body.userId,
      },
    );
  }
}