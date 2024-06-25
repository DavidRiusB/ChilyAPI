import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { City } from "src/common/enums/citys.enum";

export class UpdateAddressDto {
    @IsNotEmpty()
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    @IsEnum(City)
    city?: City;

    @IsOptional()
    @IsString()
    postalCode?: string;
}