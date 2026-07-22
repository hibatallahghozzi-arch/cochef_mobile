import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  createVillager(params: {
    fullName: string;
    email: string;
    passwordHash: string;
    phone?: string;
  }) {
    return this.prisma.user.create({
      data: {
        ...params,
        role: Role.VILLAGER,
        wallet: { create: { nfcBalance: 0 } },
      },
    });
  }

  updatePasswordHash(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
