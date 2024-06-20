import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Product) private productsRepository: Repository<Product>
    ){}
    async getProducts(page: number, limit: number): Promise<Product[]> {
        let products = await this.productsRepository.find();//Colocar relations : ["Category"]
        if(!products)throw new NotFoundException("Error al obtener los productos");
        const startIndex = (page - 1) * limit;
        const endIndex = page + limit;

        return products.slice(startIndex, endIndex);
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.productsRepository.findOne({where:{id:id}});//Colocar relations : ["Category"]
        if(!product) throw new NotFoundException("Error al obtener el producto");
        return product;
    }

    async createProduct(createProduct: Partial<Product>): Promise<Product> {
        const product =  this.productsRepository.save(createProduct);
        if(!product) throw new NotFoundException("Error al crear el producto");
        return product;
    }

    async updateProduct(id: number, updateProduct: Partial<Product>): Promise<Product> {
        const updatedProduct = await this.productsRepository.update(id, updateProduct);
        if(!updatedProduct) throw new NotFoundException("Error al actualizar el producto");
        return await this.getProductById(id);
    }

    async deleteProduct(id: number): Promise<string> {
        const product = await this.getProductById(id);
        await this.productsRepository.delete(id);
        return "Producto con id: "+id+" eliminado exitosamente";
    }
}