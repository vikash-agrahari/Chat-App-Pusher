import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOnboardingDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profileImage: string;
}

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform((param) => param.value.toLowerCase())
  email: string;
}

export class QuerySearch {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;
}

