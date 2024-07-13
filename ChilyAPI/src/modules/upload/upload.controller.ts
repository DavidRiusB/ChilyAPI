import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { DocumentationApiTagsModule } from "src/docs";
import { DocumentationUploadImg } from "src/docs/doc-upload-module/docs-endpoint-upload";

@Controller("upload")
@DocumentationApiTagsModule.clasification("Rutas para: Cargar archivos")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  //For testing
  @Post()
  @DocumentationUploadImg()
  @UseInterceptors(FileInterceptor("image"))
  async uploadImg(@UploadedFile() img: Express.Multer.File) {
    console.log(img);

    const upload = await this.uploadService.update(img);
    console.log(upload.secure_url);
    return { secure_url: upload.secure_url };
  }
}
