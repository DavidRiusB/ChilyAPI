import { ApiProperty } from "@nestjs/swagger";

const descriptions = {
  name: "Categoría Prueba",
  icon: "URL de la imagen",
};

export class DocumentationCreateCategoryDto {
  static names() {
    return ApiProperty({
      description: descriptions.name,
      example: "Hamburguesas",
    });
  }

  static icon() {
    return ApiProperty({
      description: descriptions.name,
      example: "https://exampleurl.com",
    });
  }
}
