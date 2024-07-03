import { IsNotEmpty, IsString } from "class-validator";

export class HandleCardPaymentDto {
  @IsNotEmpty({ message: "El ID del intento de pago no puede estar vacío" })
  @IsString({
    message: "El ID del intento de pago debe ser una cadena de caracteres",
  })
  paymentIntentId: string;

  @IsNotEmpty({ message: "El ID del método de pago no puede estar vacío" })
  @IsString({
    message: "El ID del método de pago debe ser una cadena de caracteres",
  })
  paymentMethodId: string;
}
