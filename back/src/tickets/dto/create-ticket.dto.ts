import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  content: string;

  @ApiProperty({ enum: Status })
  @IsString()
  @Type(() => String)
  status?: Status = Status.TODO;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  @IsOptional()
  file?: Express.Multer.File;

  @ApiProperty()
  @Type(() => Array<number>)
  participants?: number[];
}
