import { IsNotEmpty, IsString } from 'class-validator';

export class ScanOrderDto {
  @IsString()
  @IsNotEmpty()
  qrCode: string;
}