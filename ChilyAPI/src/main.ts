import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentationConfig } from './docs/';
import { ValidationPipe } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';//
dotenvConfig({
  path: ".env.development",
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  DocumentationConfig(app);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press CTRL+C to stop the server.');
}

bootstrap();
