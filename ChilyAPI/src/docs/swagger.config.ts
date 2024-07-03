import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs-extra";
import { EnvironmentVariablesDto } from "./docs-enviroments.dto";

export function DocumentationConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Donde Chily API")
    .setDescription(
      "API para la gestión del restaurante Donde Chily y sus franquicias. Consulta las variables de entorno en el archivo README.md para más detalles.",
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [EnvironmentVariablesDto],
  });

  SwaggerModule.setup("api", app, document);
}
