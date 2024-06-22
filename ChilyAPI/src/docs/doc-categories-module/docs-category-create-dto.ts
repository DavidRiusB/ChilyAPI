import { ApiProperty } from '@nestjs/swagger';

const descriptions = {
  name: 'Nombre de la categoría',
};

export class DocumentationCreateCategoryDto {
  static names() {
    return ApiProperty({
      description: descriptions.name,
      example: 'Porciones',
    });
  }
}
