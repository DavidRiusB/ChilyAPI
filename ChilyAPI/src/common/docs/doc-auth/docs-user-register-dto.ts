// docs-register-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DocsRegisterUserDto {
//   static id() {
//     return ApiProperty({
//       description: 'ID del usuario',
//       required: false,
//     });
//   }

  static names() {
    return ApiProperty({
      description: 'Nombre del usuario',
      example: 'Dueño Donde Chily',
    });
  }

  static email() {
    return ApiProperty({
      description: 'Correo electrónico del usuario',
      example: 'admin@dondechily.com',
    });
  }

  static password() {
    return ApiProperty({
      description: 'Contraseña del usuario',
      minLength: 8,
      maxLength: 15,
      pattern:
        '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+',
      example: 'DondeChily123$',
    });
  }

  static confirmPassword() {
    return ApiProperty({
      description: 'Confirmación de la contraseña',
      example: 'DondeChily123$',
    });
  }

  //   static country() {
  //     return ApiProperty({
  //       description: 'País del usuario',
  //       example: 'Argentina',
  //     });
  //   }

  //   static city() {
  //     return ApiProperty({
  //       description: 'Ciudad del usuario',
  //       example: 'Buenos Aires',
  //     });
  //   }

  static address() {
    return ApiProperty({
      description: 'Dirección del usuario',
      example: 'Buenos Aires, #17, CP:678767',
    });
  }

  static phone() {
    return ApiProperty({
      description: 'Número de teléfono del usuario',
      example: '776 678 7665',
    });
  }

  //   static role() {
  //     return ApiProperty({
  //       description: 'Rol del usuario',
  //       enum: ['USER', 'ADMIN'],
  //       example: 'ADMIN',
  //     });
  //   }
}
