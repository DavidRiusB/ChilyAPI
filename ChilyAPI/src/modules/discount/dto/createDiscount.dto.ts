import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class createDiscountDto {

    @IsOptional()
    @IsNumber()
    discount: number;
}

export class updateDiscountDto {
    @IsOptional()
    @IsNumber()
    discount: number;
}