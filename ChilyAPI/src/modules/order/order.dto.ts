import { IsArray, IsNumber, IsOptional } from "class-validator";

export class OrderDto {
  @IsNumber()
  branchId: number;
  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[];

  @IsNumber()
  @IsOptional()
  generalDiscount?: number;
}
