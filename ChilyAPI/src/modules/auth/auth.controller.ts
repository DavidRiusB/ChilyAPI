import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserLoginDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
import { DocumentationApiTagsModule } from 'src/docs';
import { DocumentationLogin, DocumentationRegister } from 'src/docs';
import { LogoutDTO } from './dto/logout.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { Request, Response } from 'express';
@Controller('auth')
@DocumentationApiTagsModule.clasification('auth')
export class AuthController {
  //
  constructor(
    private jwtService: JwtService,
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
  async logout(@Body() user: LogoutDTO) {
    return await this.authService.logout(user);
  }

  // OAuth with google
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {
    return { msg: 'Autentifiación de Google' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  redirectGoogle() {
    return { msg: 'Sesión activa' };
  }

  @Get('session/status')
  user(@Req() request: Request) {
    console.log(request.user);
    if (request.user) {
      return { msg: 'Logeado' };
    }
    return { msg: 'Sesión no iniciada' };
  }

  @Get('google/logout')
  googleLogout(@Req() request: Request, @Res() response: Response) {
    request.logout((err: any) => {
      if (err) {
        return response
          .status(500)
          .json({ msg: 'Error al cerrar sesión', error: err });
      }
      response.json({ msg: 'Sesión cerrada' });
    });
  }
}
