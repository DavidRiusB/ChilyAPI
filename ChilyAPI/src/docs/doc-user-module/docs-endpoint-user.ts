// user.controller.doc.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function DocumentacionUserGetAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Recuperar todos los usuarios con paginación' }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Número de página',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Número de usuarios por página',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuarios',
    }),
    ApiResponse({
      status: 400,
      description: 'Parámetros de consulta inválidos',
    }),
  );
}

export function DocumentationGetUserById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un usuario por ID' }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID del usuario',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Detalles del usuario',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuario con id "N", no encontrado',
    }),
  );
}

export function DocumentationUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Actualizar un usuario por ID' }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID del usuario',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Usuario actualizado exitosamente',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuario no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
    }),
  );
}

export function DocumentationSoftDeleteUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar suavemente (soft delete) un usuario por ID',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID del usuario',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Usuario eliminado suavemente',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuario no encontrado',
    }),
    ApiResponse({
      status: 400,
      description: 'ID de usuario inválido',
    }),
  );
}
