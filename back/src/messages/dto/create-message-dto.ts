import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  content: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  chatId: number;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  @IsOptional()
  file?: Express.Multer.File;
}
