import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateChatDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  title?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Array<number>)
  participants?: number[];
}
