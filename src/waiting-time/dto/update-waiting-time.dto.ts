import { IsInt, Min } from 'class-validator';

export class UpdateWaitingTimeDto {
  @IsInt()
  @Min(1)
  waitingMinutes: number;
}