import { IsNotEmpty, IsString } from "class-validator";

export class LogoutDTO {

    @IsNotEmpty()
    @IsString()
    access_token: string;
}//