import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
const toStream = require('buffer-to-stream');
@Injectable()
export class UploadService {
  async update(file: Express.Multer.File) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
          { resource_type: 'image',
            quality: 'auto:good',
           },
          (error, result) => {
              if (error) {
                  return reject(error);
              }
              resolve(result);
          }
      );
      toStream(file.buffer).pipe(upload);
  });
  }
}
