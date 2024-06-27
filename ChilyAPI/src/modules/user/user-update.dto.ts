import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/roles.enum';
import { DocumentationUserUpdateDto } from 'src/docs';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  @DocumentationUserUpdateDto.address()
  address?: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @DocumentationUserUpdateDto.phone()
  phone?: string;
}
