import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { Category } from "./category.entity";
import { createCategoryDto, UpdateCategoryDTO } from "./dto/createCategory.dto";
import { ProductsService } from "../products/products.service";
import { DataSource } from "typeorm";
import { Product } from "../products/products.entity";

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) { }
  /*async seedProducts(productsSeed) {
    const products = await this.productService.getProducts(1, 10);
    if (products.length !== 0) {
      console.log("DB alredy seeded");
      return;
    }
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
      console.log("Products seeded Succesfully.");
    });
  }*/


  getCategoryByName(name: string, page:number, limit:number): Promise<Category> {
    return this.categoryRepository.getCategoryByName(name, page, limit);
  }

  getCategories(): Promise<Category[]> {
    return this.categoryRepository.getCategories();
  }

  getCategoryById(id: number[]): Promise<Category[]> {
    return this.categoryRepository.getCategoryById(id);
  }

  
  getCategoryById2(id: number, page:number,limit:number): Promise<Category> {
    return this.categoryRepository.getCategoryById2(id, page, limit);
  }
  createCategory(createCategory: createCategoryDto): Promise<Category> {
    return this.categoryRepository.createCategory(createCategory);
  }

  updateCategory(
    id: number,
    updateCategory: UpdateCategoryDTO
  ): Promise<Category> {
    return this.categoryRepository.updateCategory(id, updateCategory);
  }

  deleteCategory(id: number): Promise<string> {
    return this.categoryRepository.deleteCategory(id);
  }
}
