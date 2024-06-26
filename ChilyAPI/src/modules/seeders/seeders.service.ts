import { Injectable, OnModuleInit } from '@nestjs/common';
import { config  as dotenvConfig} from 'dotenv';
dotenvConfig({
    path: ".env.development",
})
import { productsSeed } from './products/product-seed';
import { categorySeed } from  "./categories/category-seed";
import { DataSource, In, Repository } from 'typeorm';
import { Category } from '../category/category.entity';
import { Product } from '../products/products.entity';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
@Injectable()
export class SeedersService implements OnModuleInit{
    constructor(
      @InjectRepository(Category) private categoryRepository: Repository<Category>,
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
      
          const categoryEntity: Category[] = [];
            //Categories use names on UpperCase for consistency.
            for (const category of categorySeed) {
              const newCategory = new Category();
              newCategory.name = category.name.toUpperCase();
              newCategory.icon = category.icon;
              const savedCategory = await manager.save(newCategory);
              categoryEntity.push(savedCategory);
            }
      
            // Create and save products
            for (const productData of productsSeed) {
              const category = categoryEntity.find(c => c.name === productData.category[0].toUpperCase()) as Category
              
              const newProduct = new Product();
              newProduct.name = productData.name;
              newProduct.description = productData.description;
              newProduct.price = productData.price;
              newProduct.img = productData.img;
              newProduct.category = new Array<Category>(category);
              await manager.save(newProduct);
            }
            console.log("[SEEDERS] Products seeded Succesfully.");
          });
    } 
}
