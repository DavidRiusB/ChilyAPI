import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DocumentationCreateDiscountDto {
  static discount() {
    return ApiProperty({
      description: "Descuento a crear",
      example: 10
    });
  }
}

export class DocumentationUpdateDiscountDto {
  static discount() {
    return ApiProperty({
      description: "Nuevo valor del descuento",
      example: 15
    });
  }
}
