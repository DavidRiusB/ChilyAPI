import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";
import { DocumentationPasswordDto } from "src/docs/doc-auth-module/docs-user-password-dto";

export class PasswordDto {
  @IsNotEmpty({
    message: "El usuario ID es requerido"
  })
  @IsInt({
    message: "El usuario ID debe ser un número"
  })
  userId: number;

  @IsNotEmpty({
    message: "La nueva contraseña es requerida"
  })
  @IsString({
    message: "La nueva contraseña debe ser una cadena de texto"
  })
  @DocumentationPasswordDto.oldPassword()
  oldPassword: string;

  @IsNotEmpty({
    message: "La nueva contraseña es requerida"
  })
  @IsString({
    message: "La nueva contraseña debe ser una cadena de texto"
  })
  @DocumentationPasswordDto.newPassword()
  newPassword: string;

  @IsNotEmpty({
    message: "La confirmación de la nueva contraseña es requerida"
  })
  @IsString({
    message:
      "La confirmación de la nueva contraseña debe ser una cadena de texto"
  })
  @Match("newPassword", { message: "Las contraseñas no coinciden" })
  @DocumentationPasswordDto.confirmPassword()
  confirmPassword: string;
}
