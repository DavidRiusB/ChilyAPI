import { ProductsService } from "./products.service";
import { Product } from "./products.entity";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { createProductDto } from "./createProduct.dto";
import { DocumentationApiTagsModule } from "src/docs";
import { DocumentationAddProduct, DocumentationGetProducts } from "src/docs";
import { QueryInterceptor } from "src/common/interceptors/query.interceptor";

@Controller("products")
@DocumentationApiTagsModule.clasification("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @DocumentationGetProducts()
  @UseInterceptors(QueryInterceptor)
  getProducts(@Req() request: any): Promise<Product[]> {
    const products = this.productsService.getProducts(
      request.page,
      request.limit
    );
    return products;
  }

  @Get("category/:category")
  getProductsByCategory(@Param("category") category: string): Promise<Product[]> {
    const products = this.productsService.getProductsByCategory(category);
    return products;
  }

  @Get(":id")
  getProductById(@Param("id") id: number): Promise<Product> {
    const product = this.productsService.getProductById(id);
    return product;
  }

  @Post("create")
  @DocumentationAddProduct()
  createProduct(@Body() createProduct: createProductDto): Promise<Product> {
    const newProduct = this.productsService.createProduct(createProduct);
    return newProduct;
  }

  @Put("update/:id")
  updateProduct(
    @Param("id") id: number,
    @Body() updateProduct: createProductDto
  ): Promise<Product> {
    const updatedProduct = this.productsService.updateProduct(
      id,
      updateProduct
    );
    return updatedProduct;
  }

  @Put("disable/:id")
  disableProduct(@Param("id") id: number): Promise<Product> {
    const disabledProduct = this.productsService.disableProduct(id);
    return disabledProduct;
  }

  @Put("enable/:id")
  enableProduct(@Param("id") id: number): Promise<Product> {
    const enabledProduct = this.productsService.enableProduct(id);
    return enabledProduct;
  }

  @Delete("delete/:id")
  deleteProduct(@Param("id") id: number): Promise<string> {
    const deletedProduct = this.productsService.deleteProduct(id);
    return deletedProduct;
  }
}
