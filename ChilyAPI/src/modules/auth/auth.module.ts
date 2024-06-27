import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Credential } from "./entities/auth.entity";
import { AuthRepository } from "./auth.repository";
import { GoogleStrategy } from "./google.strategy";
import { SessionSerializer } from "src/common/helpers/serializer";
import { UserService } from "../user/user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { config as dotenvConfig } from "dotenv";
import { NotificationEmailsService } from "src/utils/shared/notification-register-emails/notificationEmails";
dotenvConfig({ path: ".env.development" });

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SecretSecret",
      signOptions: { expiresIn: "7d" },
    }),
    TypeOrmModule.forFeature([Credential]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserService,
    JwtService,
    GoogleStrategy,
    SessionSerializer,
    NotificationEmailsService,
  ],
})
export class AuthModule {
  constructor() {
    console.log(process.env.JWT_SECRET);
  }
}
