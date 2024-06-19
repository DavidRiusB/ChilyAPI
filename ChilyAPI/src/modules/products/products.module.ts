import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";

@Module({
    imports:[TypeOrmModule.forFeature([Product])],
    providers: [ProductsRepository, ProductsService],
    controllers: [ProductsController]
})

export class ProductsModule {}