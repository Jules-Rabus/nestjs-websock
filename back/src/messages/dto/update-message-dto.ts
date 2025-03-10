import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  content?: string;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  @IsOptional()
  file?: Express.Multer.File;
}
