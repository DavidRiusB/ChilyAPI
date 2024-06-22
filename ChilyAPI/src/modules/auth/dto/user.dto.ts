import { IsEmail, IsInt, IsNotEmpty } from "class-validator";

export class UserDTO {

    @IsNotEmpty()
    @IsInt()
    id: number;
    @IsNotEmpty()
    @IsEmail()
    email: string;
}