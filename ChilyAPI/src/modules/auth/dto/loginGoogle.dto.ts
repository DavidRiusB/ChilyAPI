import { IsEmail, IsNotEmpty, IsString, } from 'class-validator';


export class UserLoginGoogleDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
