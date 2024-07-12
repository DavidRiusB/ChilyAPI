// google-maps.controller.doc.ts

import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

export function DocumentacionObteinAddress() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener dirección desde Google Maps" }),
    ApiQuery({
      name: "address",
      required: true,
      description: "Dirección a consultar",
      example: "1600 Amphitheatre Parkway, Mountain View, CA",
    }),
    ApiResponse({
      status: 200,
      description: "Detalles de la dirección",
    }),
    ApiResponse({
      status: 404,
      description: "Dirección no encontrada",
    }),
    ApiResponse({
      status: 400,
      description: "Formato de dirección inválido",
    }),
  );
}
