import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat, Prisma } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat-dto';
import { UpdateChatDto } from './dto/update-chat-dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<
    (Chat & {
      participants: { id: number; email: string }[];
      _count: { messages: number };
    })[]
  > {
    return this.prisma.chat.findMany({
      include: {
        participants: { select: { id: true, email: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<
    Chat & {
      participants: { id: number; email: string }[];
      messages: { id: number; content: string; createdAt: Date }[];
    }
  > {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        participants: { select: { id: true, email: true } },
        messages: {
          select: { id: true, content: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async create(
    data: CreateChatDto,
  ): Promise<Chat & { participants: { id: number; email: string }[] }> {
    const { title, participants } = data;
    return this.prisma.chat.create({
      data: {
        title,
        participants: {
          connect: participants.map((userId) => ({ id: userId })),
        },
      },
      include: {
        participants: { select: { id: true, email: true } },
      },
    });
  }

  async update(
    id: number,
    data: UpdateChatDto,
  ): Promise<Chat & { participants: { id: number; email: string }[] }> {
    const updateData: Prisma.ChatUpdateInput = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.participants !== undefined) {
      updateData.participants = {
        set: data.participants.map((userId) => ({ id: userId })),
      };
    }
    return this.prisma.chat.update({
      where: { id },
      data: updateData,
      include: {
        participants: { select: { id: true, email: true } },
      },
    });
  }

  async remove(id: number): Promise<Chat> {
    return this.prisma.chat.delete({
      where: { id },
    });
  }
}
