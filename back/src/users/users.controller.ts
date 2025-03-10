import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/getUser';
import { Public } from 'src/decorators/public';
import { CreateOrUpdateUserDto } from './dto/create-update-user.dto';
import { FindAllUsersDto } from './dto/list-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  async findAll(@Query() query: FindAllUsersDto) {
    const users = await this.usersService.findAll(query);

    return users;
  }

  @Get('me')
  userInfo(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  createUser(@Body() body: CreateOrUpdateUserDto) {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() body: CreateOrUpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
