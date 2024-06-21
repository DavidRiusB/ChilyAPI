// swagger.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function DocumentationConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Donde Chily API')
    .setDescription(
      'API para la gestión del restaurante Donde Chily y sus franquicias',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
