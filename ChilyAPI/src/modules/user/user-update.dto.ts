import {
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { DocumentationUserUpdateDto } from 'src/docs';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  @DocumentationUserUpdateDto.phone()
  phone?: string;
}
