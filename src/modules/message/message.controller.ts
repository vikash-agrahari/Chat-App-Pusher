import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
  import { HttpResponse } from 'src/common/httpResponse';
  import { JwtUserAuthGuard } from 'src/guards/jwt-auth.guard';
  import { SessionData } from 'src/interfaces/globle.interface';
  import { Request } from 'express';
import { MessageService } from './message.service';
import { GetMessageDto, MessageDto } from './dto/message.dto';
  
  @ApiTags('User : Message')
  @Controller('/')
  export class MessageController {
    constructor(
      private readonly httpResponse: HttpResponse,
      private readonly messageService: MessageService,
    ) {}
  
    @Post('/send-message')
    @ApiOperation({ summary: 'send-message' })
    @ApiBearerAuth()
    @UseGuards(JwtUserAuthGuard)
    async sendMessage(@Body() body: MessageDto, @Req() req : Request, @Res() response: Response) {
      try {
        const sessionData : SessionData = req.user as SessionData;
        const [status, result] = await this.messageService.sendMessage(body, sessionData);
        return this.httpResponse.sendResponse(response, status, result);
      } catch (error) {
        throw error;
      }
    }

    @Get('/get-messages')
    @ApiOperation({ summary: 'get-messages' })
    @ApiBearerAuth()
    @UseGuards(JwtUserAuthGuard)
    async chatDetail(@Query() query: GetMessageDto, @Req() req : Request, @Res() response: Response) {
      try {
        const [status, result] = await this.messageService.getMessages(query);
        return this.httpResponse.sendResponse(response, status, result);
      } catch (error) {
        throw error;
      }
    }
  
    // @Post('/trigger')
    // @ApiOperation({ summary: 'trigger message' })
    // @ApiBearerAuth()
    // @UseGuards(JwtUserAuthGuard)
    // async triggerMsg(@Body() body: any, @Res() response: Response) {
    //   try {
    //     const [status, result] = await this.chatService.hitTrigger(body);
    //     return this.httpResponse.sendResponse(response, status, result);
    //   } catch (error) {
    //     throw error;
    //   }
    // }
  }
  