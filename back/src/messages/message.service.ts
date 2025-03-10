import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CreateMessageDto } from './dto/create-message-dto';
import { UpdateMessageDto } from './dto/update-message-dto';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  private s3: S3Client;

  constructor(private readonly prisma: PrismaService) {
    this.s3 = new S3Client({
      endpoint: 'http://localhost:9000',
      region: 'eu-west-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }

  async findAll(): Promise<
    (Message & {
      author: { id: number; email: string };
      chat: { id: number; title: string };
    })[]
  > {
    return this.prisma.message.findMany({
      include: {
        author: { select: { id: true, email: true } },
        chat: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number): Promise<
    Message & {
      author: { id: number; email: string };
      chat: { id: number; title: string };
    }
  > {
    const msg = await this.prisma.message.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, email: true } },
        chat: { select: { id: true, title: true } },
      },
    });
    if (!msg) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return msg;
  }

  async create(
    data: CreateMessageDto,
    file: Express.Multer.File | undefined,
    userId: number,
  ): Promise<Message & { author: { id: number; email: string } }> {
    let key: string | null = null;
    if (file) {
      key = `${Date.now()}_${file.originalname}`;
      await this.s3.send(
        new PutObjectCommand({
          Bucket: 'media',
          Key: key,
          Body: file.buffer,
        }),
      );
    }
    return this.prisma.message.create({
      data: {
        content: data.content,
        chat: { connect: { id: data.chatId } },
        author: { connect: { id: userId ?? 1 } },
        filePath: key,
      },
      include: {
        author: { select: { id: true, email: true } },
      },
    });
  }

  async update(
    id: number,
    data: UpdateMessageDto,
    file: Express.Multer.File | undefined,
  ): Promise<Message> {
    const updateData: Prisma.MessageUpdateInput = {};
    if (data.content !== undefined) {
      updateData.content = data.content;
    }
    if (file) {
      const key = `${Date.now()}_${file.originalname}`;
      await this.s3.send(
        new PutObjectCommand({
          Bucket: 'media',
          Key: key,
          Body: file.buffer,
        }),
      );
      updateData.filePath = key;
    }
    return this.prisma.message.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Message> {
    return this.prisma.message.delete({
      where: { id },
    });
  }
}
