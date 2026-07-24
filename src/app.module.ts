import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { MenusModule } from './menus/menus.module';
import { OrdersModule } from './orders/orders.module';
import { WaitingTimeModule } from './waiting-time/waiting-time.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FeedbackModule } from './feedback/feedback.module';


@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  PrismaModule,
  AuthModule,
  UsersModule,
  MealsModule,
  MenusModule,
  OrdersModule,
  WaitingTimeModule,
  FavoritesModule,
  FeedbackModule,
],
})
export class AppModule {}