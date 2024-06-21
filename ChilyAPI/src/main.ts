import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentationConfig } from './docs/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  DocumentationConfig(app);

  const PORT = 3000;

  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press CTRL+C to stop the server.');
}

bootstrap();
