// order.dto.doc.ts
import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { ProductsInOrder } from "src/modules/order/dto/order.dto";

export class DocumentationOrderDto {
  static userId() {
    return applyDecorators(
      ApiProperty({
        description: "ID del usuario que realizó el pedido",
        example: 1,
      }),
    );
  }

  static addressId() {
    return applyDecorators(
      ApiProperty({
        description: "ID de la dirección de entrega",
        example: 1,
      }),
    );
  }

  static productsInOrder() {
    return applyDecorators(
      ApiProperty({
        description: "Productos incluidos en el pedido",
        type: [ProductsInOrder],
      }),
    );
  }

  static generalDiscount() {
    return applyDecorators(
      ApiProperty({
        description: "Descuento general aplicado al pedido",
        example: 10,
        required: false,
      }),
    );
  }

  static shipping() {
    return applyDecorators(
      ApiProperty({
        description: "Costo de envío del pedido",
        example: 5,
      }),
    );
  }

  static total() {
    return applyDecorators(
      ApiProperty({
        description: "Total antes de aplicar descuentos",
        example: 100,
      }),
    );
  }

  static finalPrice() {
    return applyDecorators(
      ApiProperty({
        description: "Precio final después de aplicar descuentos",
        example: 90,
      }),
    );
  }
}
