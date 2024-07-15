import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import {
  DocumentationCreateDiscountDto,
  DocumentationUpdateDiscountDto
} from "src/docs/doc-discount-module/docs-dto-discounts";

export class createDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  @DocumentationCreateDiscountDto.discount()
  discount: number;
}

export class updateDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  @DocumentationUpdateDiscountDto.discount()
  discount: number;
}
