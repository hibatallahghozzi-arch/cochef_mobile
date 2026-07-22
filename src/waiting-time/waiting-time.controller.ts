import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { Role } from '@prisma/client';

import { WaitingTimeService } from './waiting-time.service';
import { UpdateWaitingTimeDto } from './dto/update-waiting-time.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('waiting-time')
export class WaitingTimeController {

  constructor(
    private waitingTimeService: WaitingTimeService,
  ) {}

  @Roles(Role.VILLAGER, Role.MANAGER, Role.ADMIN)
  @Get()
  getCurrent() {
    return this.waitingTimeService.getCurrentWaitingTime();
  }


  @Roles(Role.MANAGER, Role.ADMIN)
  @Patch()
  update(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: UpdateWaitingTimeDto,
  ) {
    return this.waitingTimeService.updateWaitingTime(
      req.user.id,
      dto.waitingMinutes,
    );
  }
}