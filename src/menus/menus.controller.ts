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
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menus')
export class MenusController {
  constructor(private menusService: MenusService) {}

  // Static routes ('today', 'weekly') must be declared before any ':id'
  // route in the same controller — otherwise Nest would try to match
  // "today" against :id first and never reach these handlers.
  @Get('today')
  @UseGuards(JwtAuthGuard)
  findToday() {
    return this.menusService.findToday();
  }

  @Get('weekly')
  @UseGuards(JwtAuthGuard)
  findWeekly() {
    return this.menusService.findWeekly();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  create(@Body() dto: CreateMenuDto) {
    return this.menusService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
