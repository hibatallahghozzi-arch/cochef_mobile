import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ScanOrderDto } from './dto/scan-order.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Create a new order.
   *
   * The user ID comes from the authenticated JWT.
   */
  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(
      req.user.id,
      dto,
    );
  }

  /**
   * Get all orders belonging to
   * the authenticated villager.
   */
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.findAll(
      req.user.id,
    );
  }

  /**
   * Scan a CoChef order QR code.
   *
   * Expected QR value:
   *
   * COCHEF:ORDER:<uuid>
   */
  @Post('scan')
  scanOrder(
    @Body() dto: ScanOrderDto,
  ) {
    return this.ordersService.scanOrder(
      dto.qrCode,
    );
  }

  /**
   * Get one order belonging to
   * the authenticated villager.
   */
  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.ordersService.findOne(
      id,
      req.user.id,
    );
  }

  /**
   * Update order status.
   *
   * This will later be restricted to
   * MANAGER / ADMIN using the role guard.
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(
      id,
      dto,
    );
  }
}