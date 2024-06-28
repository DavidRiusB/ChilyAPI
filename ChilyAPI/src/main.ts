// Vendors
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { config as dotenvConfig } from "dotenv";
import * as session from "express-session";
import * as passport from "passport";
// Modules
import { AppModule } from "./app.module";

// Documentation
import { DocumentationConfig } from "./docs/";

dotenvConfig({
  path: ".env.development",
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*", // Modify when the front is deployed https://example1.com
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "*", // Modify when the front is deployed 'Content-Type, Accept'
  });

  DocumentationConfig(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_PASSPORT,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Press CTRL+C to stop the server.");
}

bootstrap();
