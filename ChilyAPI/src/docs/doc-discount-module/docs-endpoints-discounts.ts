import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import {
  createDiscountDto,
  updateDiscountDto
} from "src/modules/discount/dto/createDiscount.dto";

export function DocumentationGetDiscounts() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener todos los descuentos" }),
    ApiResponse({
      status: 200,
      description: "Lista de todos los descuentos obtenida exitosamente"
    })
  );
}

export function DocumentationGetDiscountsByValid() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener descuentos por estado de validez" }),
    ApiParam({
      name: "status",
      description: "Estado de validez del descuento (true o false)",
      example: "true"
    }),
    ApiResponse({
      status: 200,
      description:
        "Lista de descuentos según su estado de validez obtenida exitosamente"
    })
  );
}

export function DocumentationGetDiscountById() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener descuento por ID" }),
    ApiParam({
      name: "id",
      description: "ID del descuento",
      example: "1"
    }),
    ApiResponse({
      status: 200,
      description: "Descuento obtenido exitosamente"
    })
  );
}

export function DocumentationGetDiscountByCode() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener descuento por código" }),
    ApiParam({
      name: "code",
      description: "Código del descuento",
      example: "DESC2024"
    }),
    ApiResponse({
      status: 200,
      description: "Descuento obtenido exitosamente"
    })
  );
}

export function DocumentationCreateDiscount() {
  return applyDecorators(
    ApiOperation({ summary: "Crear un nuevo descuento" }),
    ApiBody({ type: createDiscountDto }),
    ApiResponse({
      status: 201,
      description: "Descuento creado exitosamente"
    })
  );
}

export function DocumentationUpdateDiscount() {
  return applyDecorators(
    ApiOperation({ summary: "Actualizar un descuento existente" }),
    ApiParam({
      name: "id",
      description: "ID del descuento a actualizar",
      example: 1
    }),
    ApiBody({ type: updateDiscountDto }),
    ApiResponse({
      status: 200,
      description: "Descuento actualizado exitosamente",
      schema: {
        example: {
          id: 1,
          code: "DESC2024",
          discountPercentage: 25,
          valid: true,
          validUntil: "2024-12-31T23:59:59Z"
        }
      }
    })
  );
}

export function DocumentationInvalidDiscount() {
  return applyDecorators(
    ApiOperation({ summary: "Invalidar un descuento" }),
    ApiQuery({
      name: "code",
      description: "Código del descuento a invalidar",
      example: "DESC2024"
    }),
    ApiQuery({
      name: "userId",
      description: "ID del usuario",
      example: "user123"
    }),
    ApiResponse({
      status: 200,
      description: "Descuento invalidado exitosamente",
    })
  );
}

export function DocumentationSetDiscountToUser() {
  return applyDecorators(
    ApiOperation({ summary: "Asignar un descuento a un usuario" }),
    ApiQuery({
      name: "discount",
      description: "Código del descuento a asignar",
      example: "DESC2024"
    }),
    ApiQuery({
      name: "userId",
      description: "ID del usuario",
      example: "user123"
    }),
    ApiResponse({
      status: 200,
      description: "Descuento asignado exitosamente",
      schema: {
        example: {
          success: true,
          message: "Descuento asignado exitosamente"
        }
      }
    })
  );
}

export function DocumentationDeleteDiscount() {
  return applyDecorators(
    ApiOperation({ summary: "Eliminar un descuento" }),
    ApiParam({
      name: "id",
      description: "ID del descuento a eliminar",
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: "Descuento eliminado exitosamente",
      schema: {
        example: {
          success: true,
          message: "Descuento eliminado exitosamente"
        }
      }
    })
  );
}