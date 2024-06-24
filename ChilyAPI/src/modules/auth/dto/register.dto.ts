import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  IsPhoneNumber,
  IsStrongPassword,
  IsEnum,
} from "class-validator";
import { Role } from "src/common/enums/roles.enum";
import { DocumentationRegisterUserDto } from "src/docs";
export class RegisterUserDTO {
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  @DocumentationRegisterUserDto.names()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  //add format validator
  NIN: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  @DocumentationRegisterUserDto.email()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one symbol",
    }
  )

  @IsOptional()
  googleAuth: boolean;
  
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(15, { message: "Password must be at mouts 15 characters long" })
  @DocumentationRegisterUserDto.password()
  password: string;

  @IsString()
  // add custom validator for confirm password
  @DocumentationRegisterUserDto.confirmPassword()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsString()
  @DocumentationRegisterUserDto.address()
  address: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @DocumentationRegisterUserDto.phone()
  phone: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

}
