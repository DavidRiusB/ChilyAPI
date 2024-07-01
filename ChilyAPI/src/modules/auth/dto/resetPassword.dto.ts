import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  token?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsOptional()
  newPassword?: string;
}
