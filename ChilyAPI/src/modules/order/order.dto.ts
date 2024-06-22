import { IsArray, IsNumber } from "class-validator";

export class OrderDto {
  @IsNumber()
  branchId: number;
  @IsArray()
  @IsNumber({}, { each: true })
  productsIds: number[];
}
