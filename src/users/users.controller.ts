import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Any authenticated user (villager, manager, or admin) can read their own profile.
  @Get('me')
  async me(@CurrentUser() currentUser: { id: string }) {
    const user = await this.usersService.findById(currentUser.id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // Example of a role-restricted route: only ADMIN can hit this for now.
  // Manager-only villager-management endpoints land in a later sprint.
  @Get('admin-check')
  @Roles(Role.ADMIN)
  adminOnly() {
    return { message: 'You are authenticated as an ADMIN.' };
  }
}
