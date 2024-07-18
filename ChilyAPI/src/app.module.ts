import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import typeOrmConfig from "./config/database";
import { JwtModule } from "@nestjs/jwt";
import {
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
import { NotificationEmailsService } from "./modules/notifications/notificationEmails.service"; //
import { DiscountModule } from "./modules/discount/discount.module";
import { GoogleMapsModule } from "./modules/google-maps/google-maps.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ChatModule } from "./modules/chat/chat.module";
import { PdfService } from "./common/helpers/pdf/pdf.service";

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
    AuthModule,
    UserModule,
    ProductsModule,
    OrderModule,
    CategoryModule,
    UploadModule,
    DiscountModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    SeedersModule,
    AddressesModule,
    GoogleMapsModule,
    PaymentsModule,
    ChatModule,
  ],
  providers: [NotificationEmailsService, PdfService],
})
export class AppModule {}
