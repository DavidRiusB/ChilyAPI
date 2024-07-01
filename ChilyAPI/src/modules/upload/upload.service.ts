import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.region = configService.getOrThrow<string>("AWS_S3_REGION");
    this.bucket = this.configService.getOrThrow<string>("BUCKET");
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow("AWS_S3_REGION"),
    });
  }

  async update(fileName: string, file: Buffer, contenType: string) {
    try {
      const upload = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: fileName,
          Body: file,
          ContentType: contenType,
          ACL: "public-read",
        })
      );

      console.log(upload);
      const fileUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileName}`;

      return fileUrl;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occurred while uploading file to S3: ${error.message}`,
        error
      );
    }
  }
}
