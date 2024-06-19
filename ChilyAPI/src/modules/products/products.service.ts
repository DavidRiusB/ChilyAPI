import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { Product } from "./products.entity";

@Injectable()
export class ProductsService {
    constructor(private productsRepository: ProductsRepository){}

    getProducts(page: number, limit: number): Promise<Product[]> {
        return this.productsRepository.getProducts(page, limit);
    }

    getProductById(id: number): Promise<Product> {
        return this.productsRepository.getProductById(id);
    }

    createProduct(createProduct: Partial<Product>): Promise<Product> {
        return this.productsRepository.createProduct(createProduct);
    }

    updateProduct(id: number, updateProduct: Partial<Product>): Promise<Product> {
        return this.productsRepository.updateProduct(id, updateProduct);
    }

    deleteProduct(id: number): Promise<string> {
        return this.productsRepository.deleteProduct(id);
    }

}