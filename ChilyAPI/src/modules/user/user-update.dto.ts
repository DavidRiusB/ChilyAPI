import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Role } from 'src/common/enums';
import { DocumentationUserUpdateDto } from 'src/docs';

export class UserUpdateDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber('CO', {
    message: 'El formato de telefono es incorrecto, ejemplo: +573001234560',
  })
  @DocumentationUserUpdateDto.phone()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;
}
