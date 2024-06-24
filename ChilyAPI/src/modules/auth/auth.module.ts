import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport'; //
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './entities/auth.entity';
import { AuthRepository } from './auth.repository';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credential]),
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AuthRepository,
  ],
})
export class AuthModule {}
