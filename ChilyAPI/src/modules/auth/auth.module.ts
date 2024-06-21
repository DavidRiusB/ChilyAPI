import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "../jwt/jwt.module";
import { JwtService } from "../jwt/jwt.service";
import { JwtStrategy } from "../jwt/jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport"; //
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Credential } from "./auth.entity";
import { AuthRepository } from "./auth.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Credential]),
    JwtModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AuthRepository],
})
export class AuthModule {}
