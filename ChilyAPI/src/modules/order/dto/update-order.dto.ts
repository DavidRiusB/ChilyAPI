import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { OrderStatus } from "src/common/enums";
import { DocumentationUpdateOrderDto } from "src/docs/doc-orders-module/docs-update-order-dto";

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsInt()
  @DocumentationUpdateOrderDto.id()
  id: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  @DocumentationUpdateOrderDto.status()
  status?: OrderStatus;
}
