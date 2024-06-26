import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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
    private authService: AuthService,
  ) {}

  @Post('singin')
  @DocumentationLogin()
  async singIn(@Body() credentials: UserLoginDTO) {
    console.log(process.env.JWT_SECRET)
    return this.authService.singIn(credentials);
  }

  @Post('register')
  @DocumentationRegister()
  async register(@Body() userData: RegisterUserDTO) {
    return await this.authService.register(userData);
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  loginGoogle(@Req() req: Request, @Res() res: Response) {
    const encodedData = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(process.env.FRONTEND_URL+'/auth/google?state='+encodedData);
     return {
      msg: 'Login exitoso',
    }
  }
}