import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { City } from "src/common/enums/citys.enum";
export class CreateAddressDto {
    @IsNotEmpty()
    @IsInt()
    id: number;
    
    @IsNotEmpty()
    @IsString()
    @IsEnum(City)
    city: City;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    postalCode: string;

}