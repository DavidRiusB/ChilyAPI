// create-address.dto.doc.ts
import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { City } from "src/common/enums/citys.enum";

export class DocumentacionCreateAddressDto {
  static id() {
    return applyDecorators(
      ApiProperty({
        description: "ID de la dirección",
        example: 1,
      }),
    );
  }

  static city() {
    return applyDecorators(
      ApiProperty({
        description: "Ciudad de la dirección",
        enum: City,
        example: City.Bogota,
      }),
    );
  }

  static address() {
    return applyDecorators(
      ApiProperty({
        description: "Dirección completa",
        example: "123 Main St",
      }),
    );
  }

  static postalCode() {
    return applyDecorators(
      ApiProperty({
        description: "Código postal de la dirección",
        example: "10001",
      }),
    );
  }

  static note() {
    return applyDecorators(
      ApiProperty({
        description: "Nota adicional para la dirección",
        example: "Casa a un lado de otra casa",
        required: false,
      }),
    );
  }
}
