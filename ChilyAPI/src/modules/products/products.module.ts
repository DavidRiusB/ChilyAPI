import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";
import { Category } from '../category/category.entity';
import { ProductsController } from "./products.controller";

@Module({
    imports:[TypeOrmModule.forFeature([Product,Category])],
    providers: [ProductsRepository, ProductsService],
    controllers: [ProductsController]
})

export class ProductsModule {}