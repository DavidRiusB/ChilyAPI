import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "../jwt/jwt.service";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guards";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { UserLoginDTO } from "./dto/login.dto";
import { RegisterUserDTO } from "./dto/register.dto";
@Controller("auth")
export class AuthController {
  //
  constructor(
    private jwtService: JwtService,
    private localStrategy: LocalStrategy,
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
}
