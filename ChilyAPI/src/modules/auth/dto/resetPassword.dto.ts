import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { DocumentationResetPassword } from "src/docs";
import { DocumentationResetPasswordDto } from "src/docs/doc-auth-module/docs-resetPassword-dto";
import { DocumentationPasswordRequest } from "src/docs/doc-auth-module/docs-user-request-pasword-dto";

export class ResetPasswordDto {
  @DocumentationResetPasswordDto.token()
  @IsString()
  @IsNotEmpty()
  token: string;

  @DocumentationResetPasswordDto.newPassword()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(8)
  // repeatNewPassword: string;
}
