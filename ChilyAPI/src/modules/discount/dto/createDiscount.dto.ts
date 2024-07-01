import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class createDiscountDto {

    @IsOptional()
    @IsNumber()
    discount: number;

}