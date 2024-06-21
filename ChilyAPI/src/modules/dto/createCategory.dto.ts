import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class createCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;
}