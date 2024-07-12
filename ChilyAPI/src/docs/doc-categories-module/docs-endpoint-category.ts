import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { QueryInterceptor } from "src/common/interceptors/query.interceptor";

export function DocumentationGetCategories() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener todas las categorías" }),
    ApiResponse({
      status: 200,
      description: "Categorías obtenidas exitosamente",
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor",
    }),
  );
}

export function DocumentationGetCategoryByName() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener categoría por nombre" }),
    ApiParam({
      name: "name",
      required: true,
      description: "Nombre de la categoría",
      example: "BEBIDAS",
    }),
    UseInterceptors(QueryInterceptor),
    ApiResponse({
      status: 200,
      description: "Categoría obtenida exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Categoría no encontrada",
    }),
    ApiResponse({
      status: 400,
      description: "Error en la solicitud",
    }),
  );
}

export function DocumentationGetCategoryById() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener categoría por ID" }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID de la categoría",
      example: 14,
    }),
    UseInterceptors(QueryInterceptor),
    ApiResponse({
      status: 200,
      description: "Categoría obtenida exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Categoría no encontrada",
    }),
    ApiResponse({
      status: 400,
      description: "Error en la solicitud",
    }),
  );
}

export function DocumentationCreateCategory() {
  return applyDecorators(
    ApiOperation({ summary: "Crear una nueva categoría" }),
    ApiResponse({
      status: 201,
      description: "Categoría creada exitosamente",
    }),
    ApiResponse({
      status: 400,
      description: "Error en la solicitud",
    }),
  );
}

export function DocumentationUpdateCategory() {
  return applyDecorators(
    ApiOperation({ summary: "Actualizar una categoría existente por su ID" }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID de la categoría",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Categoría actualizada exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Categoría no encontrada",
    }),
    ApiResponse({
      status: 400,
      description: "Error en la solicitud",
    }),
  );
}

export function DocumentationDeleteCategory() {
  return applyDecorators(
    ApiOperation({ summary: "Eliminar una categoría por su ID" }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID de la categoría",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Categoría eliminada exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Categoría no encontrada",
    }),
    ApiResponse({
      status: 400,
      description: "Error en la solicitud",
    }),
  );
}
