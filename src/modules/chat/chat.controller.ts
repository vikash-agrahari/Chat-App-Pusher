import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpResponse } from 'src/common/httpResponse';
import { ChatService } from './chat.service';
import { JwtUserAuthGuard } from 'src/guards/jwt-auth.guard';
import {
  ChannelAuthDto,
  CreateChatDto,
  GetChatDto,
  GroupMembersListDto,
  LeaveGroupQueryDto,
  ManageGroupMembersDto,
} from './dto/chat.dto';
import { SessionData } from 'src/interfaces/globle.interface';
import { Request } from 'express';

@ApiTags('User : Chat')
@Controller('/')
export class ChatController {
  constructor(
    private readonly httpResponse: HttpResponse,
    private readonly chatService: ChatService,
  ) {}

  // @Post('/user-auth')
  // @ApiOperation({ summary: 'user auth api' })
  // @ApiBearerAuth()
  // @UseGuards(JwtUserAuthGuard)
  // async userAuth(@Body() body: any, @Res() response: Response) {
  //   try {
  //     const [status, result] = await this.chatService.authenticateUser(body);
  //     return this.httpResponse.sendResponse(response, status, result);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Post('/channel-auth')
  @ApiOperation({ summary: 'channel auth api' })
  @ApiBearerAuth()
  @UseGuards(JwtUserAuthGuard)
  async channelAuth(
    @Body() body: ChannelAuthDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    try {
      const sessionData: SessionData = req.user as SessionData;
      const [status, result] = await this.chatService.authorizeChannel(
        body,
        sessionData,
      );
      return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }

  @Post('/create-chat')
  @ApiOperation({ summary: 'create chat' })
  @ApiBearerAuth()
  @UseGuards(JwtUserAuthGuard)
  async createChat(
    @Body() body: CreateChatDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    try {
      const sessionData: SessionData = req.user as SessionData;
      const [status, result] = await this.chatService.createChat(
        body,
        sessionData,
      );
      return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }

  @Get('/list-chat')
  @ApiOperation({ summary: 'list chat' })
  @ApiBearerAuth()
  @UseGuards(JwtUserAuthGuard)
  async chatListing(
    @Query() query: GetChatDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    try {
      const sessionData: SessionData = req.user as SessionData;
      const [status, result] = await this.chatService.getChat(
        query,
        sessionData.userId,
      );
      return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }

  @Put('group/manage-members')
  @ApiOperation({ summary: 'Add or Remove group chat members' })
  @ApiBearerAuth()
  @UseGuards(JwtUserAuthGuard)
  async manageGroupMembers(
    @Body() body: ManageGroupMembersDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    try {
      const sessionData: SessionData = req.user as SessionData;
      const [status, result] = await this.chatService.manageGroupMembers(
        body,
        sessionData.userId,
      );
      return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }

  @Get('group/members-list')
  @ApiOperation({ summary: 'list group members' })
  @ApiBearerAuth()
  @UseGuards(JwtUserAuthGuard)
  async groupMembersListing(
    @Query() query: GroupMembersListDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    try {
      const sessionData: SessionData = req.user as SessionData;
      const [status, result] = await this.chatService.groupMembersListing(
        query,
        sessionData.userId,
      );
      return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }

  // @Delete('remove-chat')
  // @ApiOperation({ summary: 'To leave a chat group or delete a chat' })
  // @ApiBearerAuth()
  // @UseGuards(JwtUserAuthGuard)
  // async leaveChatGroup(
  //   @Query() query: LeaveGroupQueryDto,
  //   @Res() response: Response,
  //   @Req() req: Request,
  // ) {
  //   try {
  //     const sessionData: SessionData = req.user as SessionData;
  //     const [status, result] = await this.chatService.leaveChatGroup(query, sessionData);
  //     return this.httpResponse.sendResponse(response, status, result);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
