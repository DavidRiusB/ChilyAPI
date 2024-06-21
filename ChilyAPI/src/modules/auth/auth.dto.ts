import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export class CredentialsDto {
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
      message: "Correo Electronico o Contraseña incorrectos",
    }
  )
  @MinLength(8, { message: "Correo Electronico o Contraseña incorrectos" })
  @MaxLength(15, { message: "Correo Electronico o Contraseña incorrectos" })
  password: string;
}
