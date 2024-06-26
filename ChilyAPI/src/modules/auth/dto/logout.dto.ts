import { IsNotEmpty, IsString } from 'class-validator';
import { DocumentationLogoutDTO } from 'src/docs';

export class LogoutDTO {
  @IsNotEmpty()
  @IsString()
  @DocumentationLogoutDTO.accessToken()
  access_token: string;
} //
