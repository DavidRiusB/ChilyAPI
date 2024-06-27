import { Injectable, OnModuleInit } from "@nestjs/common";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({
  path: ".env.development",
});
import { productsSeed } from "./products/product-seed";
import { categorySeed } from "./categories/category-seed";
import { DataSource, In, Repository } from "typeorm";
import { Category } from "../category/category.entity";
import { Product } from "../products/products.entity";
import { ProductsService } from "../products/products.service";
import { InjectRepository } from "@nestjs/typeorm";
import { log } from "console";
@Injectable()
export class SeedersService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
    private readonly productService: ProductsService,
  ) {}
  async onModuleInit() {
    const seedersAvailable = process.env.seeders;
    if (!seedersAvailable) return;
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

      const savedProducts: Product[] = [];

      // Create and save products
      for (const productData of productsSeed) {
        const category = productData.category.map((cat) => {
          return categoryEntity.find(
            (c) => c.name === cat.toUpperCase(),
          ) as Category;
        });

        const newProduct = new Product();
        newProduct.name = productData.name;
        newProduct.description = productData.description;
        newProduct.price = productData.price;
        newProduct.img = productData.img;
        newProduct.category = category;
        newProduct.isPopular = false;

        const savedProduct = await manager.save(newProduct);
        savedProducts.push(savedProduct);
      }

      // Randomly select 3 products to be popular
      const shuffledProducts = savedProducts.sort(() => 0.5 - Math.random());
      const popularProducts = shuffledProducts.slice(0, 3);
      for (const popularProduct of popularProducts) {
        popularProduct.isPopular = true;
        await manager.save(popularProduct);
      }

      console.log("[SEEDERS] Products seeded Succesfully.");
    });
  }
}
