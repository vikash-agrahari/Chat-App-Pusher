import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class FileUploadDto {

  @ApiProperty({
    description: 'File name to be saved as blob',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;
}