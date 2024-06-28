// swagger.config.ts
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function DocumentationConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Donde Chily API")
    .setDescription(
      "API para la gestión del restaurante Donde Chily y sus franquicias",
    )
    .setVersion("1.0")
    .addCookieAuth("Token en Cookies", { type: "apiKey", in: "cookie" })
    .addOAuth2({
      type: "oauth2",
      flows: {
        authorizationCode: {
          authorizationUrl: process.env.BACKEND_URL + "/auth/google/login",
          tokenUrl: process.env.BACKEND_URL + "/auth/google/redirect",
          scopes: {
            "https://www.googleapis.com/auth/userinfo.profile":
              "Read user profile information",
            "https://www.googleapis.com/auth/userinfo.email": "Read user email",
          },
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}
