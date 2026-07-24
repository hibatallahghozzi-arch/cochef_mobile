import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: Role;
  };
};

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
  ) {}

  // Villager submits feedback
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VILLAGER)
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(req.user.id, dto);
  }


  // Villager gets his own feedback
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VILLAGER)
  findMine(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.feedbackService.findMine(req.user.id);
  }


  // Villager updates his feedback
  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VILLAGER)
  update(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(req.user.id, dto);
  }


  // Manager views all feedback
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  findAll() {
    return this.feedbackService.findAll();
  }


  // Manager views statistics
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  getStats() {
    return this.feedbackService.getStats();
  }
}