import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody
} from "@nestjs/swagger";
import { OrderStatus } from "src/common/enums";
import { OrderDto } from "src/modules/order/dto/order.dto";
import { UpdateOrderDto } from "src/modules/order/dto/update-order.dto";

export function DocumentationGetAllOrders() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener todas las órdenes" }),
    ApiQuery({
      name: "page",
      description: "Número de página para la paginación",
      required: false,
      example: "1"
    }),
    ApiQuery({
      name: "limit",
      description: "Límite de elementos por página",
      required: false,
      example: "5"
    }),
    ApiQuery({
      name: "email",
      description: "Correo electrónico del usuario",
      required: false,
      example: "romis"
    }),
    ApiQuery({
      name: "id",
      description: "ID de la orden",
      required: false,
      example: "1"
    }),
    ApiQuery({
      name: "date",
      description: "Fecha de la orden",
      required: false,
      example: "2023-07-01"
    }),
    ApiQuery({
      name: "productName",
      description: "Nombre del producto en la orden",
      required: false,
      example: "papas"
    }),
    ApiQuery({
      name: "status",
      description: "Estado de la orden",
      required: false,
      enum: OrderStatus
    }),
    ApiResponse({
      status: 200,
      description: "Órdenes obtenidas exitosamente"
    }),
    ApiResponse({
      status: 400,
      description: "Solicitud incorrecta"
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor"
    })
  );
}

export function DocumentationGetAllOrdersByBranchId() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener todas las órdenes por ID de sucursal con paginación",
      description:
        "Accesible solo por usuarios con roles de SuperAdmin y admin."
    }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID de la sucursal",
      example: 1
    }),
    ApiQuery({
      name: "page",
      required: false,
      description: "Número de página",
      example: 1
    }),
    ApiQuery({
      name: "limit",
      required: false,
      description: "Número de órdenes por página",
      example: 5
    }),
    ApiResponse({
      status: 200,
      description: "Lista de órdenes de la sucursal"
    }),
    ApiResponse({
      status: 400,
      description: "Parámetros de consulta inválidos"
    }),
    ApiResponse({
      status: 404,
      description: "Órdenes no encontradas"
    }),
    ApiResponse({
      status: 403,
      description:
        "Acceso denegado. Solo accesible por usuarios con roles de SuperAdmin y admin"
    })
  );
}

export function DocumentationGetOrderById() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener una orden por ID",
      description: "Recupera los detalles de una orden específica usando su ID."
    }),
    ApiParam({
      name: "id",
      required: true,
      description: "ID de la orden",
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: "Detalles de la orden"
    }),
    ApiResponse({
      status: 400,
      description: "Parámetros de consulta inválidos"
    }),
    ApiResponse({
      status: 404,
      description: "Orden no encontrada"
    })
  );
}

export function DocumentationPostNewOrder() {
  return applyDecorators(
    ApiOperation({
      summary: "Crear una nueva orden",
      description: "Permite a los usuarios autenticados crear una nueva orden."
    }),
    ApiBody({
      type: OrderDto,
      description: "Datos de la nueva orden"
    }),
    ApiResponse({
      status: 201,
      description: "Orden creada exitosamente"
    }),
    ApiResponse({
      status: 400,
      description: "Datos de entrada inválidos"
    }),
    ApiResponse({
      status: 401,
      description: "Usuario no autenticado"
    })
  );
}

export function DocumentationUpdateOrderStatus() {
  return applyDecorators(
    ApiOperation({
      summary: "Actualizar estado de una orden",
      description: "Permite actualizar el estado de una orden existente."
    }),
    ApiBody({
      type: UpdateOrderDto,
      description: "Datos para actualizar el estado de la orden"
    }),
    ApiResponse({
      status: 200,
      description: "Estado de la orden actualizado exitosamente"
    }),
    ApiResponse({
      status: 400,
      description: "Datos de entrada inválidos"
    })
  );
}

export function DocumentationObtainEstimatedTime() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener tiempo estimado de entrega de una orden"
    }),
    ApiQuery({
      name: "id",
      required: true,
      description: "ID de la orden",
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: "Tiempo estimado de entrega"
    }),
    ApiResponse({
      status: 404,
      description: "Orden no encontrada"
    }),
    ApiResponse({
      status: 400,
      description: "ID de orden inválido"
    })
  );
}

export function DocumentationGeneratePdf() {
  return applyDecorators(
    ApiOperation({ summary: "Generar PDF de la orden" }),
    ApiParam({
      name: "id",
      description: "ID de la orden",
      required: true,
      example: 15
    }),
    ApiResponse({
      status: 200,
      description: "PDF generado exitosamente",
      content: { "application/pdf": {} }
    }),
    ApiResponse({
      status: 400,
      description: "Solicitud incorrecta"
    }),
    ApiResponse({
      status: 404,
      description: "Orden no encontrada"
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor"
    })
  );
}

export function DocumentationGetOrdersByUser() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener órdenes por usuario" }),
    ApiParam({
      name: "id",
      description: "ID del usuario",
      required: true,
      example: 9
    }),
    ApiResponse({
      status: 200,
      description: "Órdenes obtenidas exitosamente"
    }),
    ApiResponse({
      status: 400,
      description: "Solicitud incorrecta"
    }),
    ApiResponse({
      status: 404,
      description: "Usuario no encontrado"
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor"
    })
  );
}
