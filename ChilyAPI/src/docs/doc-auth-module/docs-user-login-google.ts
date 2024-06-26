import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class DocumentationUserLoginGoogleDto {
  static email() {
    return applyDecorators(
      ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'googlegerente@dondechily.com',
      }),
    );
  }

  static names() {
    return applyDecorators(
      ApiProperty({
        description: 'Nombre del usuario',
        example: 'Gerente Juan',
      }),
    );
  }
}
