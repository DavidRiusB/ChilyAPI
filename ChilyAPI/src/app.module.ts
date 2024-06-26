import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeOrmConfig from "./config/database";
import { JwtModule } from "@nestjs/jwt";
import {
  AdminModule,
  DeliveryModule,
  SuperAdminModule,
  UserModule,
  AuthModule,
  OrderModule,
  ProductsModule,
  CategoryModule,
} from "./modules";
import { SeedersModule } from "./modules/seeders/seeders.module";
import { PassportModule } from "@nestjs/passport";
import { AddressesModule } from "./modules/addresses/addresses.module";
import { UploadModule } from "./modules/upload/upload.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get("typeorm"),
    }),
    AdminModule,
    SuperAdminModule,
    AuthModule,
    UserModule,
    DeliveryModule,
    ProductsModule,
    OrderModule,
    CategoryModule,
    UploadModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    SeedersModule,
    PassportModule.register({ session: true }),
    AddressesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
