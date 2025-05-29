import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat-dto';
import { UpdateChatDto } from './dto/update-chat-dto';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../decorators/getUser';
import { User } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll(@GetUser() user: User) {
    return this.chatService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
