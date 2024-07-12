import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class DocumentationResetPasswordDto {
  static token() {
    return applyDecorators(
      ApiProperty({
        description: "Añade el token enviado por correo electronico",
        example:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMCIsImlhdCI6MTcyMDU2MzI2MywiZXhwIjoxNzIwNTY2ODYzfQ.mDKxMrv64Vl8fwlyk5fsFZUCZu1Vb-apELGMmFA09L0",
      }),
    );
  }

  static newPassword() {
    return applyDecorators(
      ApiProperty({
        description: "Introduce la nueva contraseña",
        example: "Milanesa123$",
      }),
    );
  }
}
