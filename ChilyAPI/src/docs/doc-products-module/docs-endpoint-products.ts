import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export function DocumentationGetProducts() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener todos los productos' }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Número de página para recuperar',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Número de productos para recuperar por página',
    }),
    ApiResponse({
      status: 200,
      description: 'Devuelve todos los productos',
    }),
    ApiResponse({
      status: 400,
      description: 'Error en la solicitud',
    }),
  );
}

export function DocumentationAddProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Añadir un nuevo producto' }),
    ApiResponse({ status: 201, description: 'Producto añadido exitosamente' }),
    ApiResponse({
      status: 500,
      description: 'Error al añadir producto, verifique los datos',
    }),
    // ApiResponse({ status: 400, description: 'El producto ya existe' }),
  );
}
