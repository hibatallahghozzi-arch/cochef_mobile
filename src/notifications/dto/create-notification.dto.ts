import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsString()
  userId?: string;
}