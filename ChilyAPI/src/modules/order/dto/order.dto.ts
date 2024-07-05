import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { DocumentationOrderDto } from "src/docs/doc-orders-module/docs-order-dto";

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
  @DocumentationOrderDto.userId()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @DocumentationOrderDto.addressId()
  addressId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsInOrder)
  @DocumentationOrderDto.productsInOrder()
  productsInOrder: ProductsInOrder[];

  // @IsNumber()
  // @IsOptional()
  // @DocumentationOrderDto.generalDiscount()
  // generalDiscount?: number;

  // @IsInt()
  // @DocumentationOrderDto.shipping()
  // shipping?: number;

  @IsInt()
  @DocumentationOrderDto.total()
  total: number;

  @IsString()
  @IsOptional()
  couponId?: string | null;

  @IsNumber()
  @IsOptional()
  coupoundDiscount?: number;

  @IsString()
  formBuy: "efectivo" | "tarjeta" = "efectivo";

  // @IsInt()
  // @DocumentationOrderDto.finalPrice()
  // finalPrice: number;
}
