import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength } from "class-validator";

export class createProductDto {

    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    name: string;

    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    @IsUrl()
    image_url: string;

    @IsNotEmpty()
    @IsBoolean()
    avalible: boolean;

    @IsNotEmpty()
    @MaxLength(50)
    @IsString()
    category: string;
    
    /*
    @IsNotEmpty()
    @IsNumber()
    sucursal: number;
    */ 
}