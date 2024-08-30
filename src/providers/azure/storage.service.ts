import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONSTANT } from 'src/common/constant';

@Injectable()
export class StorageService {
  private accountName: string;
  private accountKey: string;
  private containerName: string;
  private sharedKeyCredential: StorageSharedKeyCredential;
  private blobServiceClient: BlobServiceClient;

  constructor(private readonly config: ConfigService) {
    this.accountName = this.config.get('AZURE_ACCOUNT_NAME') as string;
    this.accountKey = this.config.get('AZURE_ACCOUNT_KEY') as string;
    this.containerName = this.config.get('AZURE_CONTAINER_NAME') as string;
    this.sharedKeyCredential = new StorageSharedKeyCredential(this.accountName, this.accountKey);
    this.blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
      this.sharedKeyCredential,
    );
  }

  private generateSasToken(fileName: string, permissions: BlobSASPermissions, expiresOn: Date) {
    return generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: fileName,
        permissions,
        expiresOn,
        protocol: SASProtocol.Https,
      },
      this.sharedKeyCredential,
    ).toString();
  }

  async generatePresignedUrl(fileName: string) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const timestamp = new Date().getTime();
      const uniqueFileName = `${fileName}_${timestamp}`;

      const blobClient = containerClient.getBlobClient(uniqueFileName);
      const expiresOn = new Date();
      expiresOn.setMinutes(
        expiresOn.getMinutes() + CONSTANT.PUSHER.PRE_SIGNED_URL_EXPIRY,
      );

      const sasPermissions = new BlobSASPermissions();
      sasPermissions.write = true;

      const sasToken = this.generateSasToken(uniqueFileName, sasPermissions, expiresOn);
      const sasUrl = `${blobClient.url}?${sasToken}`;

      return { sasUrl, uniqueFileName };
    } catch (error) {
      console.log('Error in generatePresignedUrl------------->', error);
      throw error;
    }
  }

  async generateReadUrlSigned(fileName: string) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

      const blobClient = containerClient.getBlobClient(fileName);
      const expiresOn = new Date();
      expiresOn.setFullYear(expiresOn.getFullYear() + 100); // Set expiry to 100 years in the future

      const sasPermissions = new BlobSASPermissions();
      sasPermissions.read = true;

      const sasToken = this.generateSasToken(fileName, sasPermissions, expiresOn);
      const readUrl = `${blobClient.url}?${sasToken}`;

      return readUrl;
    } catch (error) {
      console.log('Error in generateReadUrl------------->', error);
      throw error;
    }
  }

  async generateReadUrlPublic(fileName: string) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

      // Set the blob access level to 'Blob' to make it public
      await containerClient.setAccessPolicy('blob');

      // The URL for the blob, which will be publicly accessible
      const blobClient = containerClient.getBlobClient(fileName);
      const publicUrl = blobClient.url;

      return publicUrl;
    } catch (error) {
      console.log('Error in makeBlobPublic------------->', error);
      throw error;
    }
  }
}
