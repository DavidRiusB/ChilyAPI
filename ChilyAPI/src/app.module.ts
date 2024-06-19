import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/database';
import {
  AdminModule,
  DeliveryModule,
  SuperAdminModule,
  UserModule,
  AuthModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }), TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm')
    }),
    UserModule,
    AdminModule,
    SuperAdminModule,
    DeliveryModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
