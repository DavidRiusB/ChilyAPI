import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { UserLoginDTO } from "./dto/login.dto";
import { RegisterUserDTO } from "./dto/register.dto";
import { DocumentationApiTagsModule, DocumentationLoginGoogle } from "src/docs";
import { DocumentationLogin, DocumentationRegister } from "src/docs";
import { GoogleAuthGuard } from "./guards/google.guard";
import { LocalAuthGuard } from "./guards/local-auth.guards";
import { Request, Response } from "express";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
@Controller("auth")
@DocumentationApiTagsModule.clasification("Rutas para: Autentificación")
export class AuthController {
  //
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Usa el guardia local
  @Post("signin")
  @DocumentationLogin()
  async singIn(@Req() credentials) {
    console.log(credentials.user);
    return this.authService.generateToken(credentials.user);
  }

  @Post("register")
  @DocumentationRegister()
  async register(@Body() userData: RegisterUserDTO) {
    return await this.authService.register(userData);
  }

  @Post("request-reset")
  async requestPasswordReset(@Body() authDto: ResetPasswordDto): Promise<void> {
    if (!authDto.email) {
      throw new Error("Por favor ingrese tu email");
    }
    return await this.authService.createResetToken(authDto.email);
  }

  @Post("reset-password")
  async resetPassword(@Body() authDto: ResetPasswordDto): Promise<void> {
    if (!authDto.token || !authDto.newPassword) {
      throw new Error("Contraseña y token requeridos");
    }
    await this.authService.resetPassword(authDto.token, authDto.newPassword);
  }

  @Get("google/login")
  @UseGuards(GoogleAuthGuard)
  @DocumentationLoginGoogle()
  googleLogin() {
    return { msg: "Redirigiendo" };
  }
  @Get("google/redirect")
  @UseGuards(GoogleAuthGuard)
  @DocumentationLoginGoogle()
  loginGoogle(@Req() req: Request, @Res() res: Response) {
    const encodedData = encodeURIComponent(JSON.stringify(req.body));
    console.log(encodedData);

    res.redirect(
      process.env.FRONTEND_URL + "/auth/google?state=" + encodedData,
    );
    return {
      msg: "Login exitoso",
    };
  }
}
