import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "../jwt/jwt.service";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "./auth.service";
import { UserLoginDTO } from "./dto/login.dto";
import { RegisterUserDTO } from "./dto/register.dto";
import { LogoutDTO } from "./dto/logout.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
@Controller("auth")
export class AuthController {
  //
  constructor(
    private authService: AuthService
  ) {}

  @Post("singin")
  async singIn(@Body() credentials: UserLoginDTO) {
    return this.authService.singIn(credentials);
  }

  @Post("register")
  async register(@Body() userData: RegisterUserDTO) {
    return await this.authService.register(userData);
  }

  @UseGuards(JwtAuthGuard)//
  @Post("logout")
  async logout(@Body() user: LogoutDTO) {
    return await this.authService.logout(user);
  }
}
