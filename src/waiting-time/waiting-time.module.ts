import { Module } from '@nestjs/common';
import { WaitingTimeController } from './waiting-time.controller';
import { WaitingTimeService } from './waiting-time.service';

@Module({
  controllers: [WaitingTimeController],
  providers: [WaitingTimeService],
  exports: [WaitingTimeService],
})
export class WaitingTimeModule {}