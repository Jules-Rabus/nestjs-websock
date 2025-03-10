import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

interface CreateUser {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

interface UpdateUser {
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll(params: { page: number; limit: number }) {
    const { page, limit } = params;
    return this.prisma.user.findMany({
      skip: limit * (page - 1),
      take: limit,
      include: {
        ticketParticipants: true,
        ticketReviewers: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  createUser(body: CreateUser) {
    return this.prisma.user.create({
      data: body,
    });
  }

  async updateUser(id: number, body: UpdateUser) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      data: body,
      where: {
        id,
      },
    });
  }

  async deleteUser(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
