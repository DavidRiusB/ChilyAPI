import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

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

export function DocumentationGetProductById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un producto por su ID' }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID del producto',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Producto obtenido exitosamente',
    }),
    ApiResponse({
      status: 404,
      description: 'Producto no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Parámetro de ID inválido',
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

export function DocumentationUpdateProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Actualizar un producto por su ID' }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID del producto',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Producto actualizado exitosamente',
    }),
    ApiResponse({
      status: 404,
      description: 'Producto no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
    }),
  );
}

export function DocumentationAvailableOrUnavaliableProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Habilitar o deshabilitar un producto por su ID' }),
    ApiQuery({
      name: 'id',
      required: true,
      description: 'ID del producto',
      example: 1,
    }),
    ApiQuery({
      name: 'status',
      required: true,
      description: 'Estado del producto (disponible o no disponible)',
      enum: ['false', 'true'],
    }),
    ApiResponse({
      status: 200,
      description: 'Estado del producto actualizado exitosamente',
    }),
    ApiResponse({
      status: 404,
      description: 'Producto no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
    }),
  );
}

export function DocumentationProductIsPopular() {
  return applyDecorators(
    ApiOperation({
      summary: 'Marcar un producto como popular o no popular por su ID',
    }),
    ApiQuery({
      name: 'id',
      required: true,
      description: 'ID del producto',
      example: 1,
    }),
    ApiQuery({
      name: 'status',
      required: true,
      description: 'Estado del producto (popular o no popular)',
      enum: ['false', 'true'],
    }),
    ApiResponse({
      status: 200,
      description: 'Estado del producto actualizado exitosamente',
    }),
    ApiResponse({
      status: 404,
      description: 'Producto no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
    }),
  );
}

export function DocumentationDeleteProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar un producto por su ID' }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID del producto',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Producto eliminado exitosamente',
      type: String,
    }),
    ApiResponse({
      status: 404,
      description: 'Producto no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Error al intentar eliminar el producto',
    }),
  );
}
