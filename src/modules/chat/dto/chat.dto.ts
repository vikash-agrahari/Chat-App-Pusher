import { IsBoolean, IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional, IsNumber, IsMongoId, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Optional } from '@nestjs/common';
import { ENUM } from 'src/common/enum';


export class MemberDto {

  @ApiProperty({
    description: ' userId unique identifier for the member ',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Username of the member',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiPropertyOptional({
    description: 'Profile image URL of the member',
  })
  @IsOptional()
  @IsString()
  profileImage: string;
}

export class CreateChatDto {
  
  @ApiPropertyOptional({
    description: 'Name of the chat',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Flag indicating if the chat is one-to-one or a group',
  })
  @IsNotEmpty()
  @IsBoolean()
  isGroup: boolean;

  @ApiPropertyOptional({
    description: 'Group photo URL',
  })
  @IsOptional()
  @IsString()
  groupPhoto: string;

  @ApiProperty({
    description: 'Array of members',
    type: [MemberDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];
}


export class GetChatDto {
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

  @ApiPropertyOptional({
    description: 'characters of a chat',
  })
  @IsOptional()
  @IsString()
  search: string;
}

export class GroupMembersListDto extends GetChatDto{
  @ApiProperty({ description: 'Group chat ID' })
  @IsMongoId()
  chatId: string;
}

export class LeaveGroupQueryDto {
  @ApiProperty({ description: 'Group chat ID' })
  @IsNotEmpty()
  @IsMongoId()
  chatId: string;
}

export class ChannelAuthDto {
  @ApiProperty({ description: 'socket id' })
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @ApiProperty({ description: 'Data limit' })
  @IsNotEmpty()
  @IsString()
  channelName: string;
}

export class ManageGroupMembersDto {
  @ApiProperty({ description: 'Group chat ID' })
  @IsMongoId()
  chatId: string;

  @ApiProperty({
    description: 'Array of members',
    type: [MemberDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[];

  @ApiProperty({ description: 'Action to be performed' })
  @IsNumber()
  @IsEnum(ENUM.GROUP_MEMBER_ACTION)
  action: number;
}