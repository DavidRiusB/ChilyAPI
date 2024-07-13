// documentation.dto.ts

import { ApiProperty } from "@nestjs/swagger";

export class DocumentationPasswordDto {
  static userId() {
    return ApiProperty({
      description: "ID del usuario",
      example: 1
    });
  }

  static oldPassword() {
    return ApiProperty({
      description: "Contraseña actual del usuario",
      example: "ContraseñaActual123$"
    });
  }

  static newPassword() {
    return ApiProperty({
      description: "Nueva contraseña del usuario",
      minLength: 8,
      maxLength: 15,
      pattern:
        "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+",
      example: "NuevaContraseña123$"
    });
  }

  static confirmPassword() {
    return ApiProperty({
      description: "Confirmación de la nueva contraseña",
      example: "NuevaContraseña123$"
    });
  }
}
