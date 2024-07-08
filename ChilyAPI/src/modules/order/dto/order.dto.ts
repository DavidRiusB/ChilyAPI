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
  @DocumentationOrderDto.userId()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @DocumentationOrderDto.addressId()
  address: Address;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductsInOrder)
  @DocumentationOrderDto.productsInOrder()
  productsInOrder: ProductsInOrder[];

  @IsString()
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
  couponId?: string | null;

  @IsNumber()
  @IsOptional()
  coupoundDiscount?: number;

  @IsString()
  formBuy: "efectivo" | "tarjeta" = "efectivo";

  @IsNumber()
  @DocumentationOrderDto.total()
  total: number;
  // @IsInt()
  // @DocumentationOrderDto.finalPrice()
  // finalPrice: number;
}
