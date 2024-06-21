import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { DocsUserLoginDto } from '../../../common/docs/index';

export class UserLoginDTO {
  id?: number;

  @IsNotEmpty()
  @IsEmail()
  @DocsUserLoginDto.email()
  email: string;

  @IsNotEmpty()
  @IsString()
  @DocsUserLoginDto.password()
  password: string;
}
