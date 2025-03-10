import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

interface CreateTicket {
  title: string;
  content: string;
  status?: Status;
}

interface UpdateTicket {
  title?: string;
  content?: string;
  status?: Status;
  participants?: number[];
  reviewers?: number[];
}

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  findAll() {
    return this.prisma.ticket.findMany({
      include: {
        participants: true,
        reviewers: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.ticket.findFirst({
      where: { id },
      include: { participants: true, reviewers: true },
    });
  }

  async create(data: CreateTicket, file: Express.Multer.File) {
    let key: string | undefined;
    if (file) {
      const client = new S3Client({
        endpoint: 'http://localhost:9000',
        region: 'eu-west-1',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
      });

      key = file.originalname;
      await client.send(
        new PutObjectCommand({
          Bucket: 'media',
          Key: key,
          Body: file.buffer,
        }),
      );
    }

    return this.prisma.ticket.create({
      data: { ...data, filePath: key ?? null },
    });
  }

  async update(id: number, data: UpdateTicket) {
    if (data.status) {
      const ticket = await this.prisma.ticket.findFirst({
        where: { id },
        select: { id: true, status: true },
      });
      if (ticket && ticket?.status !== data.status) {
        this.mailerService
          .sendMail({
            to: 'test@nestjs.com', // list of receivers
            from: 'noreply@nestjs.com', // sender address
            subject: 'Testing Nest MailerModule ✔', // Subject line
            template: 'ticket-update',
            context: {
              name: 'John Doe',
              id: ticket.id,
            },
          })
          .then(() => {
            console.log('Email sent successfully');
          })
          .catch((e) => console.error(e));
      }
    }

    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...data,
        participants: {
          set: data.participants?.map((id) => ({ id: +id })),
        },
        reviewers: {
          set: data.reviewers?.map((id) => ({ id: +id })),
        },
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
