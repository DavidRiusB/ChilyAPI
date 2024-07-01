import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from "class-validator";

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
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  addressId: number;

  @IsArray()
  @ValidateNested()
  @Type(() => ProductsInOrder)
  productsInOrder: ProductsInOrder[];

  @IsNumber()
  @IsOptional()
  generalDiscount?: number;

  @IsInt()
  shipping: number;

  @IsInt()
  total: number;

  @IsInt()
  finalPrice: number;
}
