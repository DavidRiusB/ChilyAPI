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

import { RegisterUserDTO } from "./dto/register.dto";
import {
  DocumentationApiTagsModule,
  DocumentationExcludeController,
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
import { RegisterAdminDTO } from "./dto/registerAdmin.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enums";
import { Roles } from "src/common/decorators/roles.decorator";
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

  @Post("admin/register")
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @DocumentationLogin()
  async registerNewAdmin(@Body() adminData: RegisterAdminDTO) {
    return await this.authService.registerAdmin(adminData);
  }

  @Get("google/login")
  @UseGuards(GoogleAuthGuard)
  @DocumentationLoginGoogle()
  googleLogin() {
    return { msg: "Redirigiendo" };
  }

  @Get("google/redirect")
  @UseGuards(GoogleAuthGuard)
  @DocumentationExcludeController()
  loginGoogle(@Req() req: Request, @Res() res: Response) {
    if (req.user === null) {
      let encodedMessage = encodeURIComponent("No se pudo iniciar sesión");
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google?state=${encodedMessage}`,
      );
    }
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
  @DocumentationRequestPasswordReset()
  async requestPasswordReset(@Body() { email }: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(email);
  }

  @Post("reset-password")
  @DocumentationResetPassword()
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(token, newPassword);
  }
}
