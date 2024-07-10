import { Module } from "@nestjs/common";
import { SeedersService } from "./seeders.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../products/products.entity";
import { Category } from "../category/category.entity";
import { ProductsModule } from "../products/products.module";
import { Address } from "../addresses/entities/addresses.entity";
import { AddressesModule } from "../addresses/addresses.module";
import { AddressesService } from "../addresses/addresses.service";
import { AddressRepository } from "../addresses/addresses.repository";
import { UserService } from "../user/user.service";
import { UserRepository } from "../user/user.repository";
import { User } from "../user/entity/user.entity";
import { OrderRepository } from "../order/order.repository";
import { OrderModule } from "../order/order.module";
import { Order } from "../order/entity/order.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Address, User, Order]),
    ProductsModule,
    AddressesModule,
    OrderModule,
  ],
  providers: [
    SeedersService,
    AddressesService,
    AddressRepository,
    UserService,
    UserRepository,
    OrderRepository,
  ],
})
export class SeedersModule {}
