import { ApiProperty } from '@nestjs/swagger';

const descriptions = {
  id: 'ID del producto',
  name: 'Nombre del producto',
  description: 'Descripción del producto',
  price: 'Precio del producto',
  image_url: 'URL de la imagen del producto',
  available: 'Disponibilidad del producto',
  category: 'Categoría del producto',
};

export class DocumentationCreateProductDto {
  static id() {
    return ApiProperty({ description: descriptions.id, example: 1 });
  }

  static names() {
    return ApiProperty({
      description: descriptions.name,
      example: 'Pollo Desmechado',
    });
  }

  static description() {
    return ApiProperty({
      description: descriptions.description,
      example:
        'Jugoso pollo cocido lentamente y deshilachado, sazonado con especias, ideal para tacos o arepas.',
    });
  }

  static price() {
    return ApiProperty({ description: descriptions.price, example: 8.0 });
  }

  static image_url() {
    return ApiProperty({
      description: descriptions.image_url,
      example:
        'https://th.bing.com/th/id/OIP.bTxp2cp2RXl0wsTPmBZilgHaFj?w=240&h=180&c=7&r=0&o=5&pid=1.7',
    });
  }

  static available() {
    return ApiProperty({ description: descriptions.available, example: true });
  }

  static category() {
    return ApiProperty({
      description: descriptions.category,
      example: 'Porciones',
    });
  }
}
