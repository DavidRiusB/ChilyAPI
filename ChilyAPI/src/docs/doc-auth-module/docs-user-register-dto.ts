// docs-register-user.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class DocumentationRegisterUserDto {
  //   static id() {
  //     return ApiProperty({
  //       description: 'ID del usuario',
  //       required: false,
  //     });
  //   }

  static names() {
    return ApiProperty({
      description: "Nombre completo del usuario",
      example: "Juana Antolle",
    });
  }

  static email() {
    return ApiProperty({
      description: "Correo electrónico valido",
      example: "juanis@gmail.com",
    });
  }

  static password() {
    return ApiProperty({
      description: "Contraseña del usuario",
      minLength: 8,
      maxLength: 15,
      pattern:
        "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+",
      example: "Juanis123$",
    });
  }

  static confirmPassword() {
    return ApiProperty({
      description: "Confirmación de la contraseña",
      example: "Juanis123$",
    });
  }

  //   static country() {
  //     return ApiProperty({
  //       description: 'País del usuario',
  //     });
  //   }

  //   static city() {
  //     return ApiProperty({
  //       description: 'Ciudad del usuario',
  //     });
  //   }

  static address() {
    return ApiProperty({
      description: "Dirección de residencia del usuario",
      example: "Buenos Aires, #17, cp: 545345",
    });
  }

  static phone() {
    return ApiProperty({
      description: "Número de celular del usuario",
      example: "+527751488347",
    });
  }

  static NIN() {
    return ApiProperty({
      description: "Código de identificación",
      example: "6787654567",
    });
  }
}
