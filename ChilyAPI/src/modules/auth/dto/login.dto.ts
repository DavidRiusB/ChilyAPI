import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { DocumentationUserLoginDto } from "src/docs";

export class UserLoginDTO implements DocumentationUserLoginDto {
  id?: number;

  @ApiProperty({
    description:
      "El formato de correo electrónico debe tener una estructura válida.",
    example: "juanis@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      "Contraseña que cumple con los siguientes criterios: al menos una minúscula, una mayúscula, un número, un símbolo y no menos de 8 caracteres.",
    example: "Juanis123$",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
