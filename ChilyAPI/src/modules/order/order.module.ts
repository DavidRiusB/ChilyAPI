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
import { GoogleMapsModule } from "../google-maps/google-maps.module";
import { Product } from "../products/products.entity";
import { NotificationEmailsService } from "../notifications/notificationEmails.service";
import { ProductsRepository } from "../products/products.repository";
import { CategoryRepository } from "../category/category.repository";
import { Category } from "../category/category.entity";
import { CategoryService } from "../category/category.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, Category]),
    ProductsModule,
    UserModule,
    AddressesModule,
    OrderDetailsModule,
    GoogleMapsModule,
  ],
  providers: [
    OrderService,
    OrderRepository,
    NotificationEmailsService,
    ProductsRepository,
    CategoryRepository,
    CategoryService,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
