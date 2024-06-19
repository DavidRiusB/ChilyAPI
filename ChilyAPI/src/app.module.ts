import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/database';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
