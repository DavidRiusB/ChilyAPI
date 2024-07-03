import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreatePaymentDto {
  @IsNotEmpty({ message: "El monto no puede estar vacío" })
  @IsNumber({}, { message: "El monto debe ser un número" })
  @Min(1000, { message: "El monto debe ser mayor que 10 pesos colombianos" })
  amount: number;

  @IsOptional()
  @IsString({ message: "La moneda debe ser una cadena de caracteres" })
  @IsNotEmpty({ message: "La moneda no puede estar vacía" })
  currency: string = "COP";
}
