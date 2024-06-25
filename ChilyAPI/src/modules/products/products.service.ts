import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { Product } from "./products.entity";
import { createProductDto } from "./createProduct.dto";

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  getProducts(page: number, limit: number): Promise<Product[]> {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductById(id: number): Promise<Product> {
    return this.productsRepository.getProductById(id);
  }

  async findProductsByIds(ids: number[]): Promise<Product[]> {
    return await this.productsRepository.findByIds(ids);
  }

  createProduct(createProduct: createProductDto): Promise<Product> {
    return this.productsRepository.createProduct(createProduct);
  }

  updateProduct(id: number, updateProduct: createProductDto): Promise<Product> {
    return this.productsRepository.updateProduct(id, updateProduct);
  }

  deleteProduct(id: number): Promise<string> {
    return this.productsRepository.deleteProduct(id);
  }

  availableOrUnavaliableProduct(id: number, status:string): Promise<Product> {
    return this.productsRepository.availableOrUnavaliableProduct(id, status);
  }

  productIsPopular(id: number, status: string): Promise<Product> {
    return this.productsRepository.productIsPopular(id, status);
  }
}
