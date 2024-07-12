import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ProcessPaymentDto {
  @ApiProperty({
    description: "ID del método de pago de Stripe",
    example: "pm_1GqIC8HYgolSBA35d6TB9Xgr",
  })
  @IsString()
  @IsOptional()
  paymentMethodId: string;

  @ApiProperty({ description: "Monto a cobrar", example: 5000 })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: "Moneda en la que se cobra (ISO code)",
    example: "COP",
  })
  @IsString()
  currency: string = "COP";
}
