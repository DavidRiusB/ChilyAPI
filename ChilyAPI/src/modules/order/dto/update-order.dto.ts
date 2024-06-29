import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { OrderStatus } from "src/common/enums";

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
  
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
