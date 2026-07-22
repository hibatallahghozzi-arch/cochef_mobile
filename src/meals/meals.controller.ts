import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Controller('meals')
export class MealsController {
  constructor(private mealsService: MealsService) {}

  // Public within the app: any logged-in villager can browse meals.
  // No @Roles() here — see RolesGuard from Sprint 1: no metadata means
  // "any authenticated role is fine", it just still requires a valid JWT.
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.mealsService.findAllActive();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.mealsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  create(@Body() dto: CreateMealDto) {
    return this.mealsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateMealDto) {
    return this.mealsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.mealsService.remove(id);
  }
}
