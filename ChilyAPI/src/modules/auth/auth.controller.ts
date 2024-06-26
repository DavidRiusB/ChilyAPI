import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserLoginDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
import {
  DocumentationApiTagsModule,
  DocumentationLoginGoogle,
  DocumentationLogout,
} from 'src/docs';
import { DocumentationLogin, DocumentationRegister } from 'src/docs';
import { LogoutDTO } from './dto/logout.dto';
import { UserLoginGoogleDto } from './dto/loginGoogle.dto';
@Controller('auth')
@DocumentationApiTagsModule.clasification('Rutas para: Autentificación')
export class AuthController {
  //
  constructor(
    private localStrategy: LocalStrategy,
    private authService: AuthService,
  ) {}

  @Post('singin')
  @DocumentationLogin()
  async singIn(@Body() credentials: UserLoginDTO) {
    return this.authService.singIn(credentials);
  }

  @Post('register')
  @DocumentationRegister()
  async register(@Body() userData: RegisterUserDTO) {
    return await this.authService.register(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @DocumentationLogout()
  async logout(@Body() user: LogoutDTO) {
    return await this.authService.logout(user);
  }

  @Post('google/login')
  @DocumentationLoginGoogle()
  loginGoogle(@Body() data: UserLoginGoogleDto) {
    console.log(data);
    return this.authService.googleLogin(data);
  }
}
