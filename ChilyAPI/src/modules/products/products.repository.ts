import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { createProductDto } from "../dto/createProduct.dto";
import { Category } from "../category/category.entity";

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Product) private productsRepository: Repository<Product>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
    ){}
    async getProducts(page: number, limit: number): Promise<Product[]> {
        let products = await this.productsRepository.find({relations : ["Category"]});
        if(!products)throw new NotFoundException("Error al obtener los productos");
        const startIndex = (page - 1) * limit;
        const endIndex = page + limit;

        return products.slice(startIndex, endIndex);
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.productsRepository.findOne({where:{id:id},relations : ["Category"]});
        if(!product) throw new NotFoundException("Error al obtener el producto");
        return product;
    }

    async createProduct(createProduct: createProductDto): Promise<Product> {
        const createdProduct = new Product();
        const categories = await Promise.all(
            createProduct.category.map(categoryName => 
                this.categoryRepository.findOne({where: {name: categoryName}})
            )
        );
        createdProduct.name = createProduct.name;
        createdProduct.description = createProduct.description;
        createdProduct.price=createProduct.price;
        createdProduct.avalible=createProduct.avalible;
        createdProduct.category= categories;
        const product =  this.productsRepository.save(createdProduct);
        if(!product) throw new NotFoundException("Error al crear el producto");
        return product;
    }

    async updateProduct(id: number, updateProduct: createProductDto): Promise<Product> {
        const updatedProduct = new Product();
        const categories = await Promise.all(
            updateProduct.category.map(categoryName => 
                this.categoryRepository.findOne({where: {name: categoryName}})
            )
        );
        updatedProduct.name = updateProduct.name;
        updatedProduct.description = updateProduct.description;
        updatedProduct.price=updateProduct.price;
        updatedProduct.avalible=updateProduct.avalible;
        updatedProduct.category= categories;
        const product = await this.productsRepository.update(id, updatedProduct);
        if(!product) throw new NotFoundException("Error al actualizar el producto");
        return await this.getProductById(id);
    }

    async deleteProduct(id: number): Promise<string> {
        const product = await this.getProductById(id);
        await this.productsRepository.delete(id);
        return "Producto: "+ product.name+" con id: "+id+" ha sido eliminado exitosamente";
    }
}