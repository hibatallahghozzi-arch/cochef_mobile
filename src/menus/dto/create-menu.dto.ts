import { MenuType } from '@prisma/client';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsUUID } from 'class-validator';

export class CreateMenuDto {
  // ISO date string, e.g. "2026-07-20" — @db.Date on the Prisma side ignores
  // any time-of-day portion, so we don't ask for one here either.
  @IsDateString()
  date: string;

  @IsEnum(MenuType)
  type: MenuType;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  mealIds: string[];
}
