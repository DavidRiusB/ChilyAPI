import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { DocumentationUserUpdateDto } from 'src/docs';

export class UserUpdateDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber('CO', {
    message: 'El formato de telefono es incorrecto, ejemplo: +577751488347',
  })
  @DocumentationUserUpdateDto.phone()
  phone?: string;
}
