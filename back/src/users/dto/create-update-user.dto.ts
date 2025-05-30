import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateOrUpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @Type(() => String)
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Type(() => String)
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Type(() => String)
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Type(() => String)
  color: string;
}
