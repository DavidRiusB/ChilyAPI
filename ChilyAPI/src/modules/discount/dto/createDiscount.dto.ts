import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class createDiscountDto {

    @IsNotEmpty()
    @IsNumber()
    discount: number;
}

export class updateDiscountDto {
    @IsNotEmpty()
    @IsNumber()
    discount: number;
}