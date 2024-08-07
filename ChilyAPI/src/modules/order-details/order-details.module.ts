import { Module } from "@nestjs/common";
import { OrderDetailsService } from "./order-details.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetail } from "./entity/order-details.entity";
import { OrderDetailRepository } from "./order-detail.repository";

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  providers: [OrderDetailsService, OrderDetailRepository],
  exports: [OrderDetailsService, OrderDetailRepository], // Make sure to export both if needed
})
export class OrderDetailsModule {}
