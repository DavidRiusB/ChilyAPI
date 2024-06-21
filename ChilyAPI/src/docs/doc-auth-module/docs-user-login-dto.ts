import { ApiProperty } from '@nestjs/swagger';
import { UserLoginDTO } from 'src/modules/auth/dto/login.dto';

export class DocumentationUserLoginDto {
  static email() {
    return ApiProperty({
      type: UserLoginDTO,
      description:
        'El formato de correo electrónico debe tener una estructura válida.',
      example: 'gerente@dondechily.com',
    });
  }

  static password() {
    return ApiProperty({
      type: UserLoginDTO,
      description:
        'Contraseña que cumple con los siguientes criterios: al menos una minúscula, una mayúscula, un número, un símbolo y no menos de 8 caracteres.',
      example: 'GerenteChily123$',
    });
  }
}
