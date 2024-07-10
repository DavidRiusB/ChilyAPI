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
import { User } from "../user/entity/user.entity";
import { Order } from "../order/entity/order.entity";
import { ordersSeed } from "./orders/orders-seed";
import { OrderDetail } from "../order-details/entity/order-details.entity";
import { ProductsRepository } from "../products/products.repository";

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
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const seedersAvailable = process.env.seeders;
    if (!seedersAvailable) return;

    await this.seedProducts();
    await this.seedAddresses();
    await this.seedOrders();
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
    return this.dataSource.transaction(async (manager) => {
      for (const addressData of addressesData) {
        const user = await this.userRepository.findOne({
          where: { id: addressData.userId },
        });

        if (user) {
          const newAddress = new Address();
          newAddress.address = addressData.address;
          newAddress.location = addressData.location;
          newAddress.note = addressData.note;
          newAddress.user = user;

          await manager.save(newAddress);
        }
      }

      console.log("[SEEDERS] Addresses seeded Successfully.");
    });
  }

  async seedOrders() {
    return this.dataSource
      .transaction(async (manager) => {
        for (const orderData of ordersSeed) {
          const user = await this.userRepository.findOne({
            where: { id: orderData.userId },
          });

          if (user) {
            const newOrder = new Order();
            newOrder.total = orderData.total;
            newOrder.user = user;
            newOrder.address = await this.addressRepository.findOne({
              where: { id: orderData.addressId },
            });
            newOrder.couponId = orderData.couponId;
            newOrder.couponDiscount = orderData.couponDiscount;
            newOrder.formBuy = "efectivo";
            newOrder.orderInstructions = orderData.orderInstructions;
            newOrder.date = new Date(); // Assign current date

            const savedOrder = await manager.save(newOrder);

            for (const productInOrder of orderData.productsInOrder) {
              const newOrderDetail = new OrderDetail();
              newOrderDetail.order = savedOrder;

              const product = await this.productsRepository.findOne({
                where: { id: productInOrder.productId },
              });

              if (product) {
                newOrderDetail.product = product;
                newOrderDetail.quantity = productInOrder.quantity;
                newOrderDetail.price = productInOrder.price;
                newOrderDetail.total =
                  productInOrder.quantity * productInOrder.price; // Calculate the total for this order detail

                await manager.save(newOrderDetail);
              }
            }
          }
        }

        console.log("[SEEDERS] Orders seeded Successfully.");
      })
      .catch((error) => {
        console.error("[SEEDERS] Error seeding orders:", error);
      });
  }
}
