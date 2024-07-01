import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepository } from "./order.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entity/order.entity";
import { ProductsModule } from "../products/products.module";
import { UserModule } from "../user/user.module";
import { OrderDetailsModule } from "../order-details/order-details.module";
import { AddressesModule } from "../addresses/addresses.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductsModule,
    UserModule,
    AddressesModule,
    OrderDetailsModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
