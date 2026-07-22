import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VILLAGER)
  getMyFavorites(@Req() req: Request & { user: { id: string } }) {
    return this.favoritesService.getMyFavorites(req.user.id);
  }

  @Post(':mealId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VILLAGER)
  addFavorite(
    @Req() req: Request & { user: { id: string } },
    @Param('mealId') mealId: string,
  ) {
    return this.favoritesService.addFavorite(req.user.id, mealId);
  }

  @Delete(':mealId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VILLAGER)
  removeFavorite(
    @Req() req: Request & { user: { id: string } },
    @Param('mealId') mealId: string,
  ) {
    return this.favoritesService.removeFavorite(req.user.id, mealId);
  }
}