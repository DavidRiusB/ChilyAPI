import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs-extra";
import { EnvironmentVariablesDto } from "./docs-enviroments.dto";
import { UserLoginDTO } from "src/modules/auth/dto/login.dto";

export function DocumentationConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Donde Chily API")
    .setDescription(
      "API para la gestión del restaurante Donde Chily y sus franquicias. Consulta las variables de entorno en el archivo README.md para más detalles.",
    )
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "JWT",
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [EnvironmentVariablesDto, UserLoginDTO],
  });

  SwaggerModule.setup("api", app, document);
}
