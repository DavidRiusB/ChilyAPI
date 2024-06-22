import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";

@Module({
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
