import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class PasswordDto {
    @IsNotEmpty({
        message: 'El usuario ID es requerido'
    })
    @IsInt({
        message: 'El usuario ID debe ser un número'
    })
    userId: number;

    @IsNotEmpty({
        message: 'La nueva contraseña es requerida'
    })
    @IsString({
        message: 'La nueva contraseña debe ser una cadena de texto'
    })
    oldPassword: string;

    @IsNotEmpty({
        message: 'La nueva contraseña es requerida'
    })
    @IsString({
        message: 'La nueva contraseña debe ser una cadena de texto'
    })
    newPassword: string;

    @IsNotEmpty({
        message: 'La confirmación de la nueva contraseña es requerida'
    })
    @IsString({
        message: 'La confirmación de la nueva contraseña debe ser una cadena de texto'
    })
    @Match('newPassword', { message: 'Las contraseñas no coinciden' })
    confirmPassword: string;
}