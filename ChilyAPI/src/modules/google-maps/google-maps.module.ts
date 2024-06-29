import { Module } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';
import { GoogleMapsController } from './google-maps.controller';

@Module({
  providers: [GoogleMapsService],
  controllers: [GoogleMapsController]
})
export class GoogleMapsModule {}
