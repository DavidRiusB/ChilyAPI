import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class DocumentationPasswordRequest {
  static email() {
    return applyDecorators(
      ApiProperty({
        description: "Correo electrónico del usuario",
        example: "juanis@gmail.com",
      }),
    );
  }
}
