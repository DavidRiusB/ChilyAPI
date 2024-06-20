import { IsNotEmpty, IsString, IsEmail, IsOptional, MaxLength, MinLength, IsPhoneNumber } from "class-validator";
export class RegisterUserDTO {//
    id?: number;
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(5)
    name: string;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(50)
    email: string;
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(6)
    password: string;
    @IsNotEmpty()
    @IsString()
    country: string;
    @IsNotEmpty()
    @IsString()
    city: string;
    @IsNotEmpty()
    @IsString()
    address: string;
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;
    @IsOptional()
    role?: string;
}