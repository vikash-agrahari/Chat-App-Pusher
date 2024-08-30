import { Injectable } from '@nestjs/common';
import { RESPONSE_DATA } from 'src/common/responses';
import { StorageService } from 'src/providers/azure/storage.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly storageService: StorageService) {}

  async getPresignedUrl(fileName: string) {
    try {
      const presignedUrlRes = await this.storageService.generatePresignedUrl(fileName);
      const previewUrl = await this.storageService.generateReadUrlSigned(presignedUrlRes?.uniqueFileName);
      // const publicUrl = await this.storageService.generateReadUrlPublic(presignedUrlRes?.uniqueFileName);


      return [RESPONSE_DATA.SUCCESS, { presignedUrl: presignedUrlRes.sasUrl, previewUrl }];
    } catch (error) {
      console.log('Error in getPresignedUrl------------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }
}
