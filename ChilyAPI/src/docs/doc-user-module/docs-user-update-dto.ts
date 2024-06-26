// user-update.dto.doc.ts
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class DocumentationUserUpdateDto {
  static address() {
    return applyDecorators(
      ApiProperty({
        description: 'Dirección del usuario',
        example: '123 Main St',
      }),
    );
  }

  static phone() {
    return applyDecorators(
      ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '+1234567890',
      }),
    );
  }
}
