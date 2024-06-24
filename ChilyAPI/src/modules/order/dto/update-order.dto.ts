import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "src/common/enums";

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
