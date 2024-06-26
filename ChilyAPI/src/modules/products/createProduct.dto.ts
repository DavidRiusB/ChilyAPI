import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
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

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @IsUrl()
  @DocumentationCreateProductDto.image_url()
  img: string;

  @IsNotEmpty()
  @IsNumber()
  @DocumentationCreateProductDto.category()
  category: number;

  /*
=======
  /*
>>>>>>> Stashed changes
    @IsNotEmpty()
    @IsNumber()
    sucursal: number;
    */
}
