// documentation.upload.ts

import { applyDecorators } from "@nestjs/common";
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

export function DocumentationUploadImg() {
  return applyDecorators(
    ApiOperation({ summary: "Subir imagen" }),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          image: {
            type: "string",
            format: "binary",
            description: "Archivo de imagen a subir"
          }
        }
      }
    }),
    ApiResponse({ status: 200, description: "Imagen subida exitosamente" }),
    ApiResponse({ status: 500, description: "Error interno del servidor" })
  );
}
