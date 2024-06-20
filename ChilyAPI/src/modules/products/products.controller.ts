import { ProductsService } from "./products.service";
import { Product } from "./products.entity";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";

@Controller("products")
export class ProductsController {
    constructor(private productsService: ProductsService){}

    @Get()
    getProducts(@Query('page') page: string = "1", @Query('limit') limit: string = "10"): Promise<Product[]> {
        const products = this.productsService.getProducts(Number(page), Number(limit));
        return products;
    }

    @Get(':id')
    getProductById(@Param('id') id: number): Promise<Product> {
        const product = this.productsService.getProductById(id);
        return product;
    }

    @Post("create")
    createProduct(@Body() createProduct: Partial<Product>): Promise<Product> {
        const newProduct = this.productsService.createProduct(createProduct);
        return newProduct;
    }

    @Put('update/:id')
    updateProduct(@Param('id') id: number, @Body() updateProduct: Partial<Product>): Promise<Product> {
        const updatedProduct = this.productsService.updateProduct(id, updateProduct);
        return updatedProduct;
    }

    @Delete('delete/:id')
    deleteProduct(@Param('id') id: number): Promise<string> {
        const deletedProduct = this.productsService.deleteProduct(id);
        return deletedProduct;
    }
}