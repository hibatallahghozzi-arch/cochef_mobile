import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { UsersService } from './users.service';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Any authenticated user can read their own profile
  @Get('me')
  async me(@CurrentUser() currentUser: { id: string }) {
    const user = await this.usersService.findById(currentUser.id);

    if (!user) return null;

    const { passwordHash, ...safeUser } = user;

    return safeUser;
  }

  // Save user's Expo push notification token
  @Post('push-token')
  async updatePushToken(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: UpdatePushTokenDto,
  ) {
    return this.usersService.updatePushToken(
      currentUser.id,
      dto.expoPushToken,
    );
  }

  // Example role-restricted route
  @Get('admin-check')
  @Roles(Role.ADMIN)
  adminOnly() {
    return { message: 'You are authenticated as an ADMIN.' };
  }
}