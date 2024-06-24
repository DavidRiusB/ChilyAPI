import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DocumentationCreateCategoryDto } from 'src/docs/';

export class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @DocumentationCreateCategoryDto.names()
  name: string;
}
