import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  IsPhoneNumber,
  IsStrongPassword,
} from "class-validator";
export class RegisterUserDTO {
  //
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
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
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(15, { message: "Password must be at mouts 15 characters long" })
  password: string;

  @IsString()
  // add custom validator for confirm password
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  role?: string;
}
