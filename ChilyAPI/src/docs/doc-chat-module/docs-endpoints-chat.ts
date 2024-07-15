import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

export function DocumentationGetAllChatLogs() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener todos los registros de chat" }),
    ApiQuery({
      name: "page",
      type: Number,
      required: false,
      description: "Número de página para paginación",
      example: 1
    }),
    ApiQuery({
      name: "limit",
      type: Number,
      required: false,
      description: "Cantidad de resultados por página",
      example: 10
    }),
    ApiResponse({
      status: 200,
      description: "Registros de chat obtenidos exitosamente"
    })
  );
}
