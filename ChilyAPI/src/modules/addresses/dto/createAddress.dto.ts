import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { City } from "src/common/enums/citys.enum";
import { DocumentacionCreateAddressDto } from "src/docs/docs-addresses-module/doc-create-address-dto";
export class CreateAddressDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(City)
  @DocumentacionCreateAddressDto.city()
  city: City;

  @IsNotEmpty()
  @IsString()
  @DocumentacionCreateAddressDto.address()
  address: string;

  @IsNotEmpty()
  @IsString()
  @DocumentacionCreateAddressDto.postalCode()
  postalCode: string;

  @IsOptional()
  @IsString()
  @DocumentacionCreateAddressDto.note()
  note: string;
}
