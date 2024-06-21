import { IsString, IsEmail, IsNotEmpty, IsOptional } from "class-validator";
export class UserLoginDTO {//
    id?: number;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    password: string;
}//