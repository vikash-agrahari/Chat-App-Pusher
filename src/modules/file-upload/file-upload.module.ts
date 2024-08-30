import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GuardModule } from 'src/guards/guards.module';
import { GuardService } from 'src/guards/guards.service';
import { HttpResponse } from 'src/common/httpResponse';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { StorageService } from 'src/providers/azure/storage.service';

@Module({
  imports: [ConfigModule.forRoot(), GuardModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, GuardService, HttpResponse, StorageService],
})
export class FileUploadModule {}
