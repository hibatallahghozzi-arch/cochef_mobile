import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFeedbackDto) {
    const existing = await this.prisma.feedback.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Feedback already submitted');
    }

    return this.prisma.feedback.create({
      data: {
        userId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async findMine(userId: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { userId },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return feedback;
  }

  async update(userId: string, dto: UpdateFeedbackDto) {
    const existing = await this.prisma.feedback.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Feedback not found');
    }

    return this.prisma.feedback.update({
      where: { userId },
      data: dto,
    });
  }

  findAll() {
    return this.prisma.feedback.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStats() {
    const result = await this.prisma.feedback.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      averageRating: Number(result._avg.rating ?? 0),
      totalFeedbacks: result._count.id,
    };
  }
}