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

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Address, User]),
    ProductsModule,
    AddressesModule,
  ],
  providers: [
    SeedersService,
    AddressesService,
    AddressRepository,
    UserService,
    UserRepository,
  ],
})
export class SeedersModule {}
