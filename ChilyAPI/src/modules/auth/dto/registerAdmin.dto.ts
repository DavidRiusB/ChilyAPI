import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class RegisterAdminDTO{
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match("password", { message: "La contraseña no coincide" })
    confirmPassword:string;

    @IsNotEmpty()
    @IsString()
    NIN: string;

    @IsOptional()
    @IsString()
    googleAuth: boolean;

    @IsNotEmpty()
    @IsString()
    phone: string;
}