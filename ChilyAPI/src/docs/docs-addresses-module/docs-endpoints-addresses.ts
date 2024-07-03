// user.controller.doc.ts

import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

export function DocumentationObtainUserAdress() {
  return applyDecorators(
    ApiBearerAuth(), 
    ApiOperation({ summary: "Obtener direcciones de un usuario" }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID del usuario",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Direcciones del usuario",
    }),
    ApiResponse({
      status: 404,
      description: "Usuario no encontrado",
    }),
    ApiResponse({
      status: 400,
      description: "ID de usuario inválido",
    }),
  );
}

export function DocumentacionObtainAddresse() {
  return applyDecorators(
    ApiBearerAuth(), 
    ApiOperation({ summary: "Obtener una dirección de un usuario" }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID de la dirección",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Dirección del usuario",
    }),
    ApiResponse({
      status: 404,
      description: "Dirección no encontrada",
    }),
    ApiResponse({
      status: 400,
      description: "ID de dirección inválido",
    }),
  );
}