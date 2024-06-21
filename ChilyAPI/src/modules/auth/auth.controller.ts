import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CredentialsDto } from "./auth.dto";
import { RegisterUserDTO } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("singin")
  async singIn(@Body() credential: CredentialsDto) {
    return await this.authService.singIn(credential);
  }

  @Post("register")
  async register(@Body() userData: RegisterUserDTO) {
    return await this.authService.register(userData);
  }
}
