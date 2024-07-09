import { ProductsService } from "./products.service";
import { Product } from "./products.entity";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { createProductDto, UpdateProductDto } from "./createProduct.dto";
import {
  DocumentationApiTagsModule,
  DocumentationAvailableOrUnavaliableProduct,
  DocumentationDeleteProduct,
  DocumentationGetProductById,
  DocumentationGetProductsByFilter,
  DocumentationProductIsPopular,
  DocumentationUpdateImg,
  DocumentationUpdateProduct,
  DocumentationUpdateStock,
} from "src/docs";
import { DocumentationAddProduct, DocumentationGetProducts } from "src/docs";
import { FileInterceptor } from "@nestjs/platform-express";
import { QueryFilterInterceptor } from "src/common/interceptors/queryFilter.interceptor";
import { QueryProductInterceptor } from "src/common/interceptors/queryProduct.interceptor";
import { UploadService } from "../upload/upload.service";

@Controller("products")
@DocumentationApiTagsModule.clasification("Rutas para: Productos")
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private uploadService: UploadService
  ) {}

  @Get()
  @DocumentationGetProducts()
  @UseInterceptors(QueryProductInterceptor)
  getProducts(@Req() request: any): Promise<Product[]> {
    const products = this.productsService.getProducts(
      request.page,
      request.limit
    );
    return products;
  }

  @Get("filter")
  @DocumentationGetProductsByFilter()
  @UseInterceptors(QueryFilterInterceptor)
  getProductsByFilter(@Req() request: any) {
    return this.productsService.getProductByFilter(
      request.filter,
      request.search,
      request.min,
      request.max,
      request.price,
      request.page,
      request.limit
    );
  }

  @Get(":id")
  @DocumentationGetProductById()
  getProductById(@Param("id") id: number): Promise<Product> {
    const product = this.productsService.getProductById(id);
    return product;
  }

  @Post("create")
  @DocumentationAddProduct()
  async createProduct(
    @Body() createProduct: createProductDto,
  ): Promise<Product> {
    const newProduct = await this.productsService.createProduct(createProduct);
    return newProduct;
  }

  @Put("update/:id")
  @DocumentationUpdateProduct()
  updateProduct(
    @Param("id") id: number,
    @Body() updateProduct: UpdateProductDto
  ): Promise<Product> {
    const updatedProduct = this.productsService.updateProduct(
      id,
      updateProduct
    );
    return updatedProduct;
  }

  /*@Put("available")
  @DocumentationAvailableOrUnavaliableProduct()
  availableOrUnavaliableProduct(
    @Query("id") id: number,
    @Query("status") status: string
  ): Promise<Product> {
    const disabledProduct = this.productsService.availableOrUnavaliableProduct(
      id,
      status
    );
    return disabledProduct;
  }*/

  @Delete("delete/:id")
  @DocumentationDeleteProduct()
  deleteProduct(@Param("id") id: number): Promise<string> {
    const deletedProduct = this.productsService.deleteProduct(id);
    return deletedProduct;
  }
}
