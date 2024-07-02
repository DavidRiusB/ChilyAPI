import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";

export function DocumentationGetProductsByFilter() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener productos por filtro" }),
    ApiQuery({
      name: "filter",
      required: false,
      description: "Filtro para los productos",
      example: "category",
    }),
    ApiQuery({
      name: "search",
      required: false,
      description: "Cadena de búsqueda para los productos",
      example: "smartphone",
    }),
    ApiQuery({
      name: "min",
      required: false,
      description: "Precio mínimo de los productos",
      example: 100,
    }),
    ApiQuery({
      name: "max",
      required: false,
      description: "Precio máximo de los productos",
      example: 1000,
    }),
    ApiQuery({
      name: "start",
      required: false,
      description: "Fecha de inicio para filtrar productos",
      example: "2024-01-01",
    }),
    ApiQuery({
      name: "page",
      required: false,
      description: "Número de página para paginación",
      example: 1,
    }),
    ApiQuery({
      name: "limit",
      required: false,
      description: "Número de productos por página",
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: "Lista de productos filtrados",
    }),
    ApiResponse({
      status: 400,
      description: "Parámetros de consulta inválidos",
    }),
    ApiResponse({
      status: 404,
      description: "Productos no encontrados",
    }),
  );
}

export function DocumentationGetProducts() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener todos los productos" }),
    ApiQuery({
      name: "page",
      required: false,
      description: "Número de página para recuperar",
    }),
    ApiQuery({
      name: "limit",
      required: false,
      description: "Número de productos para recuperar por página",
    }),
    ApiResponse({
      status: 200,
      description: "Devuelve todos los productos",
    }),
    ApiResponse({
      status: 400,
      description: "Error en la solicitud",
    }),
  );
}

export function DocumentationGetProductById() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener un producto por su ID" }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID del producto",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Producto obtenido exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Producto no encontrado",
    }),
    ApiResponse({
      status: 400,
      description: "Parámetro de ID inválido",
    }),
  );
}

export function DocumentationAddProduct() {
  return applyDecorators(
    ApiOperation({ summary: "Añadir un nuevo producto" }),
    ApiResponse({ status: 201, description: "Producto añadido exitosamente" }),
    ApiResponse({
      status: 500,
      description: "Error al añadir producto, verifique los datos",
    }),
    // ApiResponse({ status: 400, description: 'El producto ya existe' }),
  );
}

export function DocumentationUpdateProduct() {
  return applyDecorators(
    ApiOperation({ summary: "Actualizar un producto por su ID" }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID del producto",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Producto actualizado exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Producto no encontrado",
    }),
    ApiResponse({
      status: 400,
      description: "Datos de entrada inválidos",
    }),
  );
}

export function DocumentationAvailableOrUnavaliableProduct() {
  return applyDecorators(
    ApiOperation({ summary: "Habilitar o deshabilitar un producto por su ID" }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID del producto",
      example: 1,
    }),
    ApiQuery({
      name: "status",
      required: true,
      description: "Estado del producto (disponible o no disponible)",
      enum: ["false", "true"],
    }),
    ApiResponse({
      status: 200,
      description: "Estado del producto actualizado exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Producto no encontrado",
    }),
    ApiResponse({
      status: 400,
      description: "Datos de entrada inválidos",
    }),
  );
}

export function DocumentationProductIsPopular() {
  return applyDecorators(
    ApiOperation({
      summary: "Marcar un producto como popular o no popular por su ID",
    }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID del producto",
      example: 1,
    }),
    ApiQuery({
      name: "status",
      required: true,
      description: "Estado del producto (popular o no popular)",
      enum: ["false", "true"],
    }),
    ApiResponse({
      status: 200,
      description: "Estado del producto actualizado exitosamente",
    }),
    ApiResponse({
      status: 404,
      description: "Producto no encontrado",
    }),
    ApiResponse({
      status: 400,
      description: "Datos de entrada inválidos",
    }),
  );
}

export function DocumentationDeleteProduct() {
  return applyDecorators(
    ApiOperation({ summary: "Eliminar un producto por su ID" }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID del producto",
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: "Producto eliminado exitosamente",
      type: String,
    }),
    ApiResponse({
      status: 404,
      description: "Producto no encontrado",
    }),
    ApiResponse({
      status: 400,
      description: "Error al intentar eliminar el producto",
    }),
  );
}

export function DocumentationUpdateStock() {
  return applyDecorators(
    ApiOperation({ summary: "Actualizar el stock de un producto" }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID del producto",
      example: 1,
    }),
    ApiQuery({
      name: "stock",
      required: true,
      description: "Nuevo valor de stock",
      example: 100,
    }),
    ApiResponse({
      status: 200,
      description: "Stock actualizado exitosamente",
    }),
    ApiResponse({
      status: 400,
      description: "Parámetros de consulta inválidos",
    }),
    ApiResponse({
      status: 404,
      description: "Producto no encontrado",
    }),
  );
}

export function DocumentationUpdateImg() {
  return applyDecorators(
    ApiOperation({ summary: "Actualizar la imagen de un producto" }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID del producto",
      example: 1,
    }),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          img: {
            type: "string",
            format: "binary",
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: "Imagen actualizada exitosamente",
    }),
    ApiResponse({
      status: 400,
      description: "Parámetros de consulta inválidos o archivo no válido",
    }),
    ApiResponse({
      status: 404,
      description: "Producto no encontrado",
    }),
  );
}
