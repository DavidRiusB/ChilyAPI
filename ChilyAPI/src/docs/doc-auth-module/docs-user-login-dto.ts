import { ApiProperty } from "@nestjs/swagger";

export class DocumentationUserLoginDto {
  @ApiProperty({
    description:
      "El formato de correo electrónico debe tener una estructura válida.",
    example: "juanis@gmail.com",
  })
  email: string;

  @ApiProperty({
    description:
      "Contraseña que cumple con los siguientes criterios: al menos una minúscula, una mayúscula, un número, un símbolo y no menos de 8 caracteres.",
    example: "Juanis123$",
  })
  password: string;
}
