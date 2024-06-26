import { IsEmail, IsNotEmpty, IsString, IsUrl, isURL } from 'class-validator';
import { DocumentationUserLoginGoogleDto } from 'src/docs';

export class UserLoginGoogleDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @DocumentationUserLoginGoogleDto.email()
  email: string;

  @IsNotEmpty()
  @IsString()
  @DocumentationUserLoginGoogleDto.names()
  name: string;
}
