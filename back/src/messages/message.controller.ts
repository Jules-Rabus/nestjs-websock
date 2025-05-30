import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Sse,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message-dto';
import { UpdateMessageDto } from './dto/update-message-dto';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/decorators/getUser';
import { User } from '@prisma/client';
import { map, Observable } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly prisma: PrismaService,
  ) {}
  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  create(
    @GetUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.messageService.create(createMessageDto, file, user.id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.messageService.update(+id, updateMessageDto, file);
  }

  @Post(':id/read')
  markRead(@GetUser() user: User, @Param('id') id: string) {
    return this.messageService.markRead(+id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }

  @Sse('events/:chatId')
  async events(
    @GetUser() user: User,
    @Param('chatId') chatIdParam: string,
  ): Promise<Observable<{ data: any }>> {
    const chatId = Number(chatIdParam);
    const chat: { id: number } | null = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        participants: { some: { id: user.id } },
      },
    });
    if (!chat) {
      throw new NotFoundException(
        `Chat ${chatId} introuvable ou vous n'en êtes pas participant`,
      );
    }

    return this.messageService
      .streamMessages(chatId)
      .pipe(map((message) => ({ data: message })));
  }
}
