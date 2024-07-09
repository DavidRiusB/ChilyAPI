import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  //For testing
   @Post()
  @UseInterceptors(FileInterceptor("image"))
  async uploadImg(@UploadedFile() img: Express.Multer.File) {
    console.log(img);

    const upload = await this.uploadService.update(
      img
    );
    console.log(upload.secure_url);
    return {secure_url: upload.secure_url}
  }
}
