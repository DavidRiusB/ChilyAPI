import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserLoginDTO } from './dto/login.dto';
import { RegisterUserDTO } from './dto/register.dto';
@Controller('auth')
export class AuthController {//
    constructor(private jwtService: JwtService, private localStrategy: LocalStrategy, private authService: AuthService) {}

    @Post('login')
    async login(@Body() user: UserLoginDTO) {
        return this.authService.login(user.email, user.password); // asdasd
    }

    @Post('register') 
    async register(@Body() user: RegisterUserDTO) {
        return 'This action adds a new user: '+user;
    }
    @UseGuards(JwtAuthGuard)
    @Get('test')
    test() {
        return 'Ruta protegida'
    }
}
