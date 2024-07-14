import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse
} from "@nestjs/swagger";
import { applyDecorators } from "@nestjs/common";

export function DocumentationCreatePaymentIntent() {
  return applyDecorators(
    ApiOperation({ summary: "Crear un Payment Intent" }),
    ApiResponse({
      status: 200,
      description: "Payment Intent creado exitosamente",
      schema: {
        example: {
          clientSecret: "pi_1F4s2s2s2s2s2s2s2s2s2s2_secret_2s2s2s2s2s2s2"
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: "Solicitud incorrecta, verifica los datos proporcionados"
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor"
    })
  );
}

export function DocumentationHandleCardPayment() {
  return applyDecorators(
    ApiOperation({ summary: "Procesar pago con tarjeta" }),
    ApiResponse({
      status: 201,
      description: "Pago procesado exitosamente",
      schema: {
        example: {
          paymentIntent: {
            id: "pi_1F8T9d2eZvKYlo2C9JDdGh9T",
            amount: 1099,
            currency: "usd",
            status: "succeeded"
          }
        }
      }
    }),
    ApiBadRequestResponse({
      description: "Solicitud incorrecta",
      schema: {
        example: {
          statusCode: 400,
          message: "Descripción del error",
          error: "Bad Request"
        }
      }
    })
  );
}

export function DocumentationGetAllTransactionsByStripe() {
  return applyDecorators(
    ApiOperation({ summary: "Obtener todas las transacciones de Stripe" }),
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
      description: "Transacciones obtenidas exitosamente",
      schema: {
        example: {
          orders: [
            {
              id: "txn_1J4mYf2eZvKYlo2C0e3s",
              amount: 1099,
              currency: "usd",
              status: "succeeded",
              created: "2023-07-13T12:34:56Z"
            },
            {
              id: "txn_1J4mYf2eZvKYlo2C0e3t",
              amount: 2099,
              currency: "usd",
              status: "failed",
              created: "2023-07-14T14:56:34Z"
            }
          ],
          total: 2
        }
      }
    })
  );
}
