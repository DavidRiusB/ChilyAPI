import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class DocumentationLogoutDTO {
  static accessToken() {
    return applyDecorators(
      ApiProperty({
        description: 'Token de acceso del usuario',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }),
    );
  }
}
