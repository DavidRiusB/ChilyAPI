import { Module } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { JwtModule as NestJwtModule } from "@nestjs/jwt"; //
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: "testesttttt",
        signOptions: { expiresIn: "60m" },
      }),
    }),
  ],
  providers: [JwtService, JwtStrategy],
  exports: [JwtService],
})
export class JwtModule {}
