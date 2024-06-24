import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class ProductsInOrder {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsOptional()
  individualDiscount?: number;

  @IsNumber()
  individualPrice: number;
}

export class OrderDto {
  @IsNumber()
  branchId: number;

  @IsArray()
  @ValidateNested()
  @Type(() => ProductsInOrder)
  productsInOrder: ProductsInOrder[];

  @IsNumber()
  @IsOptional()
  generalDiscount?: number;
}
