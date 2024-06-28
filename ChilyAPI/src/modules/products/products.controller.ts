import { ProductsService } from "./products.service";
import { Product } from "./products.entity";
import {
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
import { createProductDto } from "./createProduct.dto";
import {
  DocumentationApiTagsModule,
  DocumentationAvailableOrUnavaliableProduct,
  DocumentationDeleteProduct,
  DocumentationGetProductById,
  DocumentationProductIsPopular,
  DocumentationUpdateProduct,
} from "src/docs";
import { DocumentationAddProduct, DocumentationGetProducts } from "src/docs";
import { QueryInterceptor } from "src/common/interceptors/query.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";
import { PriceQueryInterceptor } from "src/common/interceptors/queryPrice.interceptor";
import { QueryFilterInterceptor } from "src/common/interceptors/queryFilter.interceptor";

@Controller("products")
@DocumentationApiTagsModule.clasification("Rutas para: Productos")
export class ProductsController {
  constructor(private productsService: ProductsService) { }

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

  @Get("filter")
  @UseInterceptors(QueryFilterInterceptor)
  getProductsByFilter(@Req() request:any, @Query('filter') filter: string, @Query('search') search:string){
    return this.productsService.getProductByFilter(filter, search, request.min, request.max, request.page, request.limit);
  }

  @Get(":id")
  @DocumentationGetProductById()
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
  @DocumentationUpdateProduct()
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

  @Put("available")
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
  }

  @Put("popular")
  @DocumentationProductIsPopular()
  productIsPopular(
    @Query("id") id: number,
    @Query("status") status: string
  ): Promise<Product> {
    const updatedProduct = this.productsService.productIsPopular(id, status);
    return updatedProduct;
  }

  @Put("img/:id")
  @UseInterceptors(FileInterceptor("img"))
  async updateImg(
    @Param("id") id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB file size limit
          new FileTypeValidator({ fileType: "image/jpeg|image/png|image/jpg" }),
        ],
      })
    )
    img: Express.Multer.File
  ) {
    const updateProduct = await this.productsService.updateImg(
      id,
      img.originalname,
      img.buffer
    );

    return await updateProduct;
  }

  @Delete("delete/:id")
  @DocumentationDeleteProduct()
  deleteProduct(@Param("id") id: number): Promise<string> {
    const deletedProduct = this.productsService.deleteProduct(id);
    return deletedProduct;
  }
}
