import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AdminModule,
  DeliveryModule,
  SuperAdminModule,
  UserModule,
  AuthModule,
} from './modules';

@Module({
  imports: [
    UserModule,
    AdminModule,
    SuperAdminModule,
    DeliveryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
