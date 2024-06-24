import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { JwtService } from '../jwt/jwt.service';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport'; //
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { SessionsModule } from '../sessions/sessions.module';
import { SessionsService } from '../sessions/sessions.service';
import { GoogleStrategy } from './Google.strategy';
import { UserGoogle } from './auth-google.entity';
import { SessionSerialize } from './serializerGoogle';

@Module({
  imports: [
    TypeOrmModule.forFeature([Credential, UserGoogle]),
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
    GoogleStrategy,
    SessionSerialize,
    {
      provide: 'AUTH_REPOSITORY',
      useClass: AuthRepository,
    },
  ],
})
export class AuthModule {}
