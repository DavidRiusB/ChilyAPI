import { Injectable, OnModuleInit } from '@nestjs/common';
import { config  as dotenvConfig} from 'dotenv';
dotenvConfig({
    path: ".env.development",
})
import { productsSeed } from './products/product-seed';
import { DataSource } from 'typeorm';
import { Category } from '../category/category.entity';
import { Product } from '../products/products.entity';
import { ProductsService } from '../products/products.service';
@Injectable()
export class SeedersService implements OnModuleInit{
    constructor(
        private readonly dataSource: DataSource,
        private readonly productService: ProductsService
    ) {}
    async onModuleInit() {
        const seedersAvailable = process.env.seeders;
        if(!seedersAvailable) return;
        const products = await this.productService.getProducts(1, 10);
        if (products.length !== 0) {
          console.log("[SEEDERS] Products alredy seeded");
          return;
        }
        await this.seedProducts();
    }
    async seedProducts() {

        return this.dataSource.transaction(async (manager) => {
            const categoryNameSet = [
              ...new Set(productsSeed.map((item) => item.category)),
            ];
            const categoryEntity = [];
      
            console.log(categoryNameSet);
      
            for (const name of categoryNameSet) {
              const newCategory = new Category();
              newCategory.name = String(name);
              newCategory.description = `Las ${name} mas deliciosas!!`;
              const savedCategory = await manager.save(newCategory);
              categoryEntity.push(savedCategory);
            }
      
            // Create and save products
            for (const productData of productsSeed) {
              const category = categoryEntity.find(
                (category) => category.name === productData.category
              );
      
              const newProduct = new Product();
              newProduct.name = productData.name;
              newProduct.description = productData.description;
              newProduct.price = productData.price;
              newProduct.img = productData.img;
              newProduct.available = productData.available;
              newProduct.category = category;
              await manager.save(newProduct);
            }
            console.log("[SEEDERS] Products seeded Succesfully.");
          });
    } 
}
