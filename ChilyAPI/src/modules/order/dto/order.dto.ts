import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { DocumentationCreateOrderDto } from "src/docs/doc-orders-module/doc-create-order-dto";
import { DocumentationOrderDto } from "src/docs/doc-orders-module/docs-order-dto";
import { Address } from "src/modules/addresses/entities/addresses.entity";

export class ProductsInOrder {
  @IsNumber()
  productId: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  // @IsNumber()
  // @IsOptional()
  // individualDiscount?: number;

  // @IsNumber()
  // individualPrice: number;
}

export class OrderDto {
  @IsNotEmpty()
  @IsNumber()
  @DocumentationCreateOrderDto.userId()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @DocumentationCreateOrderDto.addressId()
  address: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsInOrder)
  @DocumentationCreateOrderDto.productsInOrder()
  productsInOrder: ProductsInOrder[];

  @IsString()
  @DocumentationCreateOrderDto.orderInstructions()
  orderInstructions: string;

  // @IsNumber()
  // @IsOptional()
  // @DocumentationOrderDto.generalDiscount()
  // generalDiscount?: number;

  // @IsInt()
  // @DocumentationOrderDto.shipping()
  // shipping?: number;

  @IsString()
  @IsOptional()
  @DocumentationCreateOrderDto.couponId()
  couponId?: string | null;

  @IsNumber()
  @IsOptional()
  @DocumentationCreateOrderDto.couponDiscount()
  couponDiscount?: number;

  @IsString()
  @DocumentationCreateOrderDto.formBuy()
  formBuy: "efectivo" | "tarjeta" = "efectivo";

  @IsNumber()
  @DocumentationCreateOrderDto.total()
  total: number;

  // @IsInt()
  // @DocumentationOrderDto.finalPrice()
  // finalPrice: number;
}
