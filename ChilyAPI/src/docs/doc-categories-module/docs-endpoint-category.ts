import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DocumentationAddCategory() {
  return applyDecorators(
    ApiOperation({ summary: 'Añadir una nueva categoría' }),
    ApiResponse({ status: 201, description: 'Categoria añadido exitosamente' }),
    ApiResponse({
      status: 500,
      description: 'Error al añadir categoría, verifique los datos',
    }),
    // ApiResponse({ status: 400, description: 'El producto ya existe' }),
  );
}
