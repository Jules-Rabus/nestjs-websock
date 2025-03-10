import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ListTicketsDto {
  @ApiProperty({ enum: Status, required: false })
  @IsString()
  @IsOptional()
  @Type(() => String)
  status?: Status;
}
