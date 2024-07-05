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
import {
  DocumentationApiTagsModule,
  DocumentationLoginGoogle,
  DocumentationRequestPasswordReset,
  DocumentationResetPassword,
} from "src/docs";
import { DocumentationLogin, DocumentationRegister } from "src/docs";
import { GoogleAuthGuard } from "./guards/google.guard";
import { LocalAuthGuard } from "./guards/local-auth.guards";
import { Request, Response } from "express";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import { RequestPasswordResetDto } from "./dto/requestPasswordReset.dto";
@Controller("auth")
@DocumentationApiTagsModule.clasification("Rutas para: Autentificación")
export class AuthController {
  //
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Usa el guardia local
  @Post("signin")
  @DocumentationLogin()
  async signIn(@Req() req, @Body() credentials: UserLoginDTO) {
    console.log(req.user);
    return this.authService.generateToken(req.user);
  }

  @Post("register")
  @DocumentationRegister()
  async register(@Body() userData: RegisterUserDTO) {
    return await this.authService.register(userData);
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
    const encodedData = encodeURIComponent(JSON.stringify(req.user));
    console.log(encodedData);

    res.redirect(
      process.env.FRONTEND_URL + "/auth/google?state=" + encodedData,
    );
    return {
      msg: "Login exitoso",
    };
  }

  @Post("request-password-reset")
  async requestPasswordReset(@Body() { email }: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(email);
  }

  @Post("reset-password")
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(token, newPassword);
  }
}
