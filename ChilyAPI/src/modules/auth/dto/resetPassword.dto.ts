import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(8)
  // repeatNewPassword: string;
}
