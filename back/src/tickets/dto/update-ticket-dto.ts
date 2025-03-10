import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  title?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => String)
  content?: string;

  @ApiProperty({ enum: Status })
  @IsOptional()
  @IsString()
  @Type(() => String)
  status?: Status = Status.TODO;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  @IsOptional()
  file?: Express.Multer.File;

  @ApiProperty()
  @IsOptional()
  @Type(() => Array<number>)
  participants?: number[];

  @ApiProperty()
  @IsOptional()
  @Type(() => Array<number>)
  reviewers?: number[];
}
