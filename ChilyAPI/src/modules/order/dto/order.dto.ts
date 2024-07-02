import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @ValidateNested()
  @Type(() => ProductsInOrder)
  @DocumentationOrderDto.productsInOrder()
  productsInOrder: ProductsInOrder[];

  @IsNumber()
  @IsOptional()
  @DocumentationOrderDto.generalDiscount()
  generalDiscount?: number;

  @IsInt()
  @DocumentationOrderDto.shipping()
  shipping: number;

  @IsInt()
  @DocumentationOrderDto.total()
  total: number;

  @IsInt()
  @DocumentationOrderDto.finalPrice()
  finalPrice: number;
}
