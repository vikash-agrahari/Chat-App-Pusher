import { Body, Controller, Get, Post, Query, Req, Res, Search, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpResponse } from 'src/common/httpResponse';
import { UserOnBoardingService } from './on-boarding.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOnboardingDto, LoginDto, QuerySearch } from './dto/on-boarding.dto';
import { JwtUserAuthGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express';
import { SessionData } from 'src/interfaces/globle.interface';

@ApiTags('User : OnBoarding')
@Controller('/')
export class UserOnBoardingController {
  constructor(
    private readonly httpResponse: HttpResponse,
    private readonly userOnBoardingService: UserOnBoardingService,
  ) {}

  @Post('/signup')
  @ApiOperation({ summary: 'sign api' })
  @ApiBasicAuth()
  @UseGuards(AuthGuard('basic'))
  async signup(
    @Body() createOnboardingDto: CreateOnboardingDto,
    @Res() response: Response,
  ) {
    try {
      const [status, result] =
      await this.userOnBoardingService.signUp(createOnboardingDto);
    return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
    
  }

  @Post('/login')
  @ApiOperation({ summary: 'login api' })
  @ApiBasicAuth()
  @UseGuards(AuthGuard('basic'))
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ) {
    try {
      const [status, result] =
      await this.userOnBoardingService.login(loginDto);
    return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }

  @Get('/list')
  @ApiOperation({ summary: 'user list api' })
  @ApiBearerAuth()
  @UseGuards(JwtUserAuthGuard)
  async userList(
    @Query() querySearch: QuerySearch,
    @Req() req : Request,
    @Res() response: Response,
  ) {
    try {
      const sessionData : SessionData = req.user as SessionData;
      const [status, result] =
      await this.userOnBoardingService.userList(querySearch, sessionData);
    return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }
}
