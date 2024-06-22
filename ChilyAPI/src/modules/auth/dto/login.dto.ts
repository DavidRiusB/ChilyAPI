import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { DocumentationUserLoginDto } from 'src/docs';
export class UserLoginDTO {
  id?: number;

  @IsNotEmpty()
  @IsEmail()
  @DocumentationUserLoginDto.email()
  email: string;

  @IsNotEmpty()
  @IsString()
  @DocumentationUserLoginDto.password()
  password: string;
}
