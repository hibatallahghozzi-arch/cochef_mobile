import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMealDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number) // form/JSON numbers arrive as strings from some clients; coerce before validating
  price: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  proteinsG?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lipidsG?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fibersG?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
