import { IsBoolean, IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';                                                      
import { MemberDto } from 'src/modules/chat/dto/chat.dto';

export class MessageDto {

  @ApiProperty({
    description: '_id unique id for message',
  })
  @IsNotEmpty()
  @IsString()
  _id: string;
  
  @ApiPropertyOptional({
    description: 'Text',
  })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Image',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Video',
  })
  @IsOptional()
  @IsString()
  video: string;

  @ApiProperty({
    description: 'chat id',
  })
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @ApiProperty({
    description: 'socket id for unique identifier',
  })
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @ApiProperty({
    description: 'sender of message',
    type: MemberDto,
  })
  @Type(() => MemberDto)
  sender: MemberDto;
}

export class GetMessageDto {
  @ApiProperty({ description: 'page number' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @ApiProperty({ description: 'Data limit' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    description: 'id of chat',
  })
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
