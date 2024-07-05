import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class Location {
  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  lng: number;
}

export class CreateAddressDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location = {
    lat: 0,
    lng: 0,
  };

  @IsOptional()
  @IsString()
  note: string;
}
