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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message-dto';
import { UpdateMessageDto } from './dto/update-message-dto';
import { MessageService } from './message.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from '../decorators/getUser';
import { User } from '@prisma/client';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
