import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpResponse } from 'src/common/httpResponse';
import { JwtUserAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileUploadService } from './file-upload.service';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('User : File Upload')
@Controller('/')
export class FileUploadController {
  constructor(
    private readonly httpResponse: HttpResponse,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get('presigned-url')
  @ApiOperation({ summary: 'API to generate pre-signed URL' })
  @ApiBearerAuth()
  @UseGuards(JwtUserAuthGuard)
  async getPresignedUrl(
    @Query() fileUploadDto: FileUploadDto,
    @Res() response: Response,
  ) {
    try {
      const [status, result] = await this.fileUploadService.getPresignedUrl(fileUploadDto?.fileName);
      return this.httpResponse.sendResponse(response, status, result);
    } catch (error) {
      throw error;
    }
  }
}

