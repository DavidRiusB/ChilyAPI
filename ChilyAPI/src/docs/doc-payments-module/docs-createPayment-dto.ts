import { ApiProperty } from "@nestjs/swagger";

export class DocumentationCreatePaymentDto {
  static amount() {
    return ApiProperty({
      description: "El monto del pago en centavos",
      example: 1000,
      minimum: 1000,
      type: Number
    });
  }

  static currency() {
    return ApiProperty({
      description: "La moneda del pago",
      example: "COP",
      type: String,
      default: "COP"
    });
  }
}
