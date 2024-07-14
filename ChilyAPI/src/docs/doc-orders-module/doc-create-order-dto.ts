import { ApiProperty } from "@nestjs/swagger";
import { ProductsInOrder } from "src/modules/order/dto/order.dto";

export class DocumentationCreateOrderDto {
  static userId() {
    return ApiProperty({
      description: "ID del usuario que realiza la orden",
      example: 9
    });
  }

  static addressId() {
    return ApiProperty({
      description: "ID de la dirección de envío",
      example: 1
    });
  }

  static productsInOrder() {
    return ApiProperty({
      description: "Lista de productos en la orden",
      type: [ProductsInOrder],
      example: [
        {
          productId: 3,
          name: "Porciones arroz chorizo de cerdo 6",
          price: 6,
          quantity: 1
        },
        {
          productId: 5,
          name: "Porciones carne desmechada 8.5",
          price: 8.5,
          quantity: 2
        }
      ]
    });
  }

  static orderInstructions() {
    return ApiProperty({
      description: "Instrucciones especiales para la orden",
      example: "Dejar en la puerta"
    });
  }

  static couponId() {
    return ApiProperty({
      description: "ID del cupón utilizado (opcional)",
      example: "SUMMER2024"
    });
  }

  static couponDiscount() {
    return ApiProperty({
      description: "Descuento aplicado por el cupón (opcional)",
      example: 10
    });
  }

  static formBuy() {
    return ApiProperty({
      description: "Método de pago utilizado",
      example: "efectivo",
      enum: ["efectivo", "tarjeta"]
    });
  }

  static total() {
    return ApiProperty({
      description: "Total a pagar por la orden",
      example: 21.3
    });
  }
}
