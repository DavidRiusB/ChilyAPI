import { IsString, IsNumber, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ProcessPaymentDto {
  @ApiProperty({
    description: "Token del método de pago generado por Stripe",
    example: "pm_1GqIC8HYgolSBA35d6TB9Xgr",
  })
  @IsString()
  paymentMethodId: string;

  @ApiProperty({
    description: "Monto a cobrar en centavos",
    example: 5000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: "Moneda en la que se cobra (ISO code)",
    example: "COP",
  })
  @IsString()
  currency: string;
}
