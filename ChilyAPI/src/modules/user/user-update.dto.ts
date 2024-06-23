import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";
import { Role } from "src/common/enums/roles.enum";

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone?: string;
}
