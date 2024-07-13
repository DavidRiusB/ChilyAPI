import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { DocumentationCreateCategoryDto } from "src/docs/";

export class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @DocumentationCreateCategoryDto.names()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @DocumentationCreateCategoryDto.icon()
  icon: string;
}


export class UpdateCategoryDTO {
  
  @IsOptional()
  @IsUrl()
  @DocumentationCreateCategoryDto.icon()
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @DocumentationCreateCategoryDto.names()
  name?: string;
}