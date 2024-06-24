import { IsEmail, IsNotEmpty, IsString, IsUrl, isURL } from "class-validator";


export class UserLoginGoogleDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}