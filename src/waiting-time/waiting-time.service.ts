import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WaitingTimeService {
  constructor(private prisma: PrismaService) {}

  async getCurrentWaitingTime() {
    const latest = await this.prisma.waitingTime.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latest) {
      throw new NotFoundException(
        'No waiting time has been recorded yet',
      );
    }

    return {
      waitingMinutes: latest.waitingMinutes,
      updatedAt: latest.updatedAt,
    };
  }


  async updateWaitingTime(
    managerId: string,
    waitingMinutes: number,
  ) {
    return this.prisma.waitingTime.create({
      data: {
        waitingMinutes,
        setById: managerId,
      },
    });
  }
}