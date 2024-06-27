import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { Product } from "./products.entity";
import { createProductDto } from "./createProduct.dto";
import { UploadService } from "../upload/upload.service";
import { DataSource } from "typeorm";

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource
  ) { }

  getProducts(page: number, limit: number): Promise<Product[]> {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductById(id: number): Promise<Product> {
    return this.productsRepository.getProductById(id);
  }

  getCategoryByFilter(filter: string, page: number, limit: number): Promise<Product[]> {
    if (filter != "") {
      const filterNumber = filter.split(",").map((id) => Number(id)).filter(id => !isNaN(id));
      return this.productsRepository.getCategoryByFilter(filterNumber, page, limit);
    } else {
      return this.productsRepository.getProducts(page, limit);
    }
  }

  getProductsByPriceRange(min: number, max: number, page: number, limit: number): Promise<Product[]> {
    return this.productsRepository.getProductsByPriceRange(min, max, page, limit);
  }

  getProductsBySearch(search: string, page: number, limit: number): Promise<Product[]> {
    if (search != "") {
      return this.productsRepository.getProductsBySearch(search, page, limit);
    } else {
      return this.productsRepository.getProducts(page, limit);
    }
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

  availableOrUnavaliableProduct(id: number, status: string): Promise<Product> {
    return this.productsRepository.availableOrUnavaliableProduct(id, status);
  }

  productIsPopular(id: number, status: string): Promise<Product> {
    return this.productsRepository.productIsPopular(id, status);
  }

  async updateImg(id: number, originalname: string, buffer: Buffer) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const product = await this.getProductById(id);
        let fileName = originalname;

        // If product already has an imgName, use it; otherwise, set imgName and save
        if (product.imgName) {
          fileName = product.imgName;
        } else {
          product.imgName = fileName;
          await manager.save(Product, product); // This might throw error on unique constraint violation
        }

        const uploadImg = await this.uploadService.update(fileName, buffer);

        // Handle S3 upload failure
        if (!uploadImg) {
          throw new InternalServerErrorException(
            "Error al cargar imagen a S3."
          );
        }

        // Update product's img property with the new URL
        product.img = uploadImg;
        await manager.save(Product, product);

        return product;
      } catch (error) {
        if (error.code === "23505") {
          throw new BadRequestException("Nombre de archivo duplicado.");
        }
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Producto con id:${id}, no encontrado.`);
        }

        // Catch other potential errors and rethrow with a more specific message or handle as needed
        throw new InternalServerErrorException(
          `Error al actualizar imagen del producto ${id}.`,
          error
        );
      }
    });
  }
}
