import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("upload")
export class UploadController {
  //For testing
  @Post()
  @UseInterceptors(FileInterceptor("img"))
  uploadImg(@UploadedFile() img: Express.Multer.File) {
    console.log(img);
  }
}
