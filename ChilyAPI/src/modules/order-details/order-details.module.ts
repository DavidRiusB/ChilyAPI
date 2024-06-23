import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsController } from './order-details.controller';

@Module({
  providers: [OrderDetailsService],
  controllers: [OrderDetailsController]
})
export class OrderDetailsModule {}
