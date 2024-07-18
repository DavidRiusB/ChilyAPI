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
import { Match } from "src/common/decorators/match.decorator";
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
  @DocumentationRegisterUserDto.NIN()
  NIN: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  @DocumentationRegisterUserDto.email()
  email: string;

  @IsOptional()
  googleAuth: boolean;

  @MinLength(8, { message: "La contrasena debe tener al menos 8 caracteres" })
  @MaxLength(40, {
    message: "La contraseña debe tener como maximo 40 caracteres",
  })
  @DocumentationRegisterUserDto.password()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match("password", { message: "La contraseña no coincide" })
  @DocumentationRegisterUserDto.confirmPassword()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString({
    message: 'El número de teléfono es requerido'
  })
  @DocumentationRegisterUserDto.phone()
  phone: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
