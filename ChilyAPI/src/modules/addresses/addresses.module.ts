import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { AddressRepository } from './addresses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/addresses.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UserModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  })],
  providers: [AddressesService, AddressRepository],
  controllers: [AddressesController]
})
export class AddressesModule {}
