import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./products.entity";
import { ProductsRepository } from "./products.repository";
import { ProductsService } from "./products.service";
import { Category } from "../category/category.entity";
import { ProductsController } from "./products.controller";
import { UploadModule } from "../upload/upload.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), UploadModule],
  providers: [ProductsRepository, ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
