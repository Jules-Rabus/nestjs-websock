import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty()
  @Type(() => Array<number>)
  participants: number[];
}
