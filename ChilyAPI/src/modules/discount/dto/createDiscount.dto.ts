import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class createDiscountDto {

    @IsOptional()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
    @IsNumber()
    user : number;

}

export class updateDiscountDto {
    @IsOptional()
    @IsNumber()
    discount: number;
}