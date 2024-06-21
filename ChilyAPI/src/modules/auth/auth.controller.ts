import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
