import { IsEmail, IsNotEmpty } from "class-validator";
import { DocumentationPasswordRequest } from "src/docs/doc-auth-module/docs-user-request-pasword-dto";

export class RequestPasswordResetDto {
  @DocumentationPasswordRequest.email()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
