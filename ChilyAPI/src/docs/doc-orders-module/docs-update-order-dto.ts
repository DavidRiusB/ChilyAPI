// update-order.dto.doc.ts
import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { OrderStatus } from "src/common/enums";

export class DocumentationUpdateOrderDto {
  static id() {
    return applyDecorators(
      ApiProperty({
        description: "ID del pedido a actualizar",
        example: 1,
      }),
      IsNotEmpty(),
      IsInt(),
    );
  }

  static status() {
    return applyDecorators(
      ApiProperty({
        description: "Nuevo estado del pedido",
        enum: OrderStatus,
        enumName: "OrderStatus",
        required: false,
      }),
      IsEnum(OrderStatus),
      IsOptional(),
    );
  }
}
