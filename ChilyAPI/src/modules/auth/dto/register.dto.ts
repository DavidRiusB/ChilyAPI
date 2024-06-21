import { Type } from 'class-transformer';
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
} from 'class-validator';
import { DocsRegisterUserDto } from 'src/common/docs';
import { Role } from 'src/common/enums/roles.enum';
export class RegisterUserDTO {
  // @DocsRegisterUserDto.id()
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  @DocsRegisterUserDto.names()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  @DocsRegisterUserDto.email()
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
        'Password must contain at least one uppercase letter, one lowercase letter, and one symbol',
    },
  )
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(15, { message: 'Password must be at mouts 15 characters long' })
  @DocsRegisterUserDto.password()
  password: string;

  @IsString()
  // add custom validator for confirm password
  @DocsRegisterUserDto.confirmPassword()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  // @DocsRegisterUserDto.country()
  country?: string;

  @IsNotEmpty()
  @IsString()
  // @DocsRegisterUserDto.city()
  city?: string;

  @IsNotEmpty()
  @IsString()
  @DocsRegisterUserDto.address()
  address: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @DocsRegisterUserDto.phone()
  phone: string;

  @IsOptional()
  @IsEnum(Role)
  // @DocsRegisterUserDto.role()
  role?: Role;
}
