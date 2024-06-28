import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class createDiscountDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(15)
    code: string;

    @IsOptional()
    @IsNumber()
    discount: number;

}