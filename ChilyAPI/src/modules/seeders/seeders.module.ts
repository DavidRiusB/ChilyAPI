import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/products.entity';
import { Category } from '../category/category.entity';//
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), ProductsModule],
  providers: [SeedersService]
})
export class SeedersModule {}
