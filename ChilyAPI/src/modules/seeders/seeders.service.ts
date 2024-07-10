import { Injectable, OnModuleInit } from "@nestjs/common";
import { config as dotenvConfig } from "dotenv";
import { DataSource, Repository } from "typeorm";
import { Category } from "../category/category.entity";
import { Product } from "../products/products.entity";
import { ProductsService } from "../products/products.service";
import { InjectRepository } from "@nestjs/typeorm";

import { addressesData } from "./address/addresses.seed";
import { productsSeed } from "./products/product-seed";
import { categorySeed } from "./categories/category-seed";
import { AddressesService } from "../addresses/addresses.service";
import { AddressRepository } from "../addresses/addresses.repository";
import { Address } from "../addresses/entities/addresses.entity";

dotenvConfig({
  path: ".env.development",
});

@Injectable()
export class SeedersService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
    private readonly productService: ProductsService,
    private readonly addressService: AddressesService,
    private readonly addressRepository: AddressRepository,
  ) {}

  async onModuleInit() {
    const seedersAvailable = process.env.seeders;
    if (!seedersAvailable) return;

    await this.seedProducts();
    await this.seedAddresses();
  }

  async seedProducts() {
    const products = await this.productService.getProducts(1, 10);
    if (products.length !== 0) {
      console.log("[SEEDERS] Products already seeded");
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      const categoryEntity: Category[] = [];

      for (const category of categorySeed) {
        const newCategory = new Category();
        newCategory.name = category.name.toUpperCase();
        newCategory.icon = category.icon;
        const savedCategory = await manager.save(newCategory);
        categoryEntity.push(savedCategory);
      }

      const savedProducts: Product[] = [];

      for (const productData of productsSeed) {
        const category = productData.category.map((cat) =>
          categoryEntity.find((c) => c.name === cat.toUpperCase()),
        );

        const newProduct = new Product();
        newProduct.name = productData.name;
        newProduct.description = productData.description;
        newProduct.price = productData.price;
        newProduct.img = productData.img;
        newProduct.stock = productData.stock;
        newProduct.category = category;
        newProduct.isPopular = false;

        const savedProduct = await manager.save(newProduct);
        savedProducts.push(savedProduct);
      }

      const shuffledProducts = savedProducts.sort(() => 0.5 - Math.random());
      const popularProducts = shuffledProducts.slice(0, 3);
      for (const popularProduct of popularProducts) {
        popularProduct.isPopular = true;
        await manager.save(popularProduct);
      }

      console.log("[SEEDERS] Products seeded Successfully.");
    });
  }

  async seedAddresses() {
    const addresses = await this.addressRepository.findAllAddresses();
    if (addresses.length !== 0) {
      console.log("[SEEDERS] Addresses already seeded");
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      for (const addressData of addressesData) {
        const newAddress = new Address();
        newAddress.id = addressData.id;
        newAddress.address = addressData.address;
        newAddress.location = addressData.location;
        newAddress.note = addressData.note;

        await manager.save(newAddress);
      }

      console.log("[SEEDERS] Addresses seeded Successfully.");
    });
  }
}
