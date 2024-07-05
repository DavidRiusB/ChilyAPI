import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";
import { DocumentationCreateProductDto } from "src/docs";

export class createProductDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  @DocumentationCreateProductDto.names()
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @DocumentationCreateProductDto.description()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @DocumentationCreateProductDto.price()
  price: number;

  @IsOptional()
  @IsNumber()
  stock : number;

  @IsNotEmpty()
  @IsArray()
  @DocumentationCreateProductDto.category()
  category: number[];

  /*
=======
  /*
>>>>>>> Stashed changes
    @IsNotEmpty()
    @IsNumber()
    sucursal: number;
    */
}
