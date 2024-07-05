import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { Product } from "./products.entity";
import { createProductDto, UpdateProductDto } from "./createProduct.dto";
import { UploadService } from "../upload/upload.service";
import { DataSource } from "typeorm";

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource
  ) {}

  getProducts(page: number, limit: number): Promise<Product[]> {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductById(id: number): Promise<Product> {
    return this.productsRepository.getProductById(id);
  }

  getCategoryByFilter(filter: string): Promise<Product[]> {
    const filterNumber = filter
      .split(",")
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));
    return this.productsRepository.getCategoryByFilter(filterNumber);
  }

  getProductsByPriceRange(min: number, max: number): Promise<Product[]> {
    return this.productsRepository.getProductsByPriceRange(min, max);
  }

  getProductsBySearch(search: string): Promise<Product[]> {
    return this.productsRepository.getProductsBySearch(search);
  }

  async getProductByFilter(
    filter: string,
    search: string,
    min: number,
    max: number,
    price: string,
    page: number,
    limit: number
  ): Promise<Product[]> {
    // First I get all products into products
    let products: Product[] = await this.productsRepository.getAllProducts();

    // Check if filter is not empty
    if (filter != "") {
      // Call other method to get products by category
      const productsFilter = await this.getCategoryByFilter(filter);

      // Concatenate the results with the original products array
      products = products.concat(productsFilter);

      // Create a map to count how many times each product appears in the new array
      const productCountMap = new Map<number, number>();

      // Count how many times each product appears in the new array
      products.forEach((product) => {
        const count = productCountMap.get(product.id) || 0;
        productCountMap.set(product.id, count + 1);
      });

      // Eliminate products with less than 2 occurrences
      products = products.filter(
        (product) => productCountMap.get(product.id) > 1
      );

      // Remove duplicates by comparing product ids
      products = products.filter(
        (product, index, productArray) =>
          index === productArray.findIndex((p) => p.id === product.id)
      );
    }

    if (search != "") {
      const productsSearch = await this.getProductsBySearch(search);
      products = products.concat(productsSearch);

      const productCountMap = new Map<number, number>();

      products.forEach((product) => {
        const count = productCountMap.get(product.id) || 0;
        productCountMap.set(product.id, count + 1);
      });
      products = products.filter(
        (product) => productCountMap.get(product.id) > 1
      );

      products = products.filter(
        (product, index, productArray) =>
          index === productArray.findIndex((p) => p.id === product.id)
      );
    }

    if (min != 0 || max != Infinity) {
      const productsPriceRange = await this.getProductsByPriceRange(min, max);
      products = products.concat(productsPriceRange);

      const productCountMap = new Map<number, number>();

      products.forEach((product) => {
        const count = productCountMap.get(product.id) || 0;
        productCountMap.set(product.id, count + 1);
      });
      products = products.filter(
        (product) => productCountMap.get(product.id) > 1
      );

      products = products.filter(
        (product, index, productArray) =>
          index === productArray.findIndex((p) => p.id === product.id)
      );
    }

    switch (price.toLowerCase()){
      case "min": products = products.sort((a,b)=> a.price - b.price);break;
      case "max": products = products.sort((a,b)=> b.price - a.price);break;
      default: break;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    return paginatedProducts;
  }

  async findProductsByIds(ids: number[]): Promise<Product[]> {
    return await this.productsRepository.findByIds(ids);
  }

  async updateStock(id: number, stock: number): Promise<Product> {
    return await this.productsRepository.updateStock(id, stock);
  }

  createProduct(createProduct: createProductDto, fileUrl: string): Promise<Product> {
    return this.productsRepository.createProduct(createProduct, fileUrl);
  }

  updateProduct(id: number, updateProduct: UpdateProductDto): Promise<Product> {
    return this.productsRepository.updateProduct(id, updateProduct);
  }

  deleteProduct(id: number): Promise<string> {
    return this.productsRepository.deleteProduct(id);
  }

  /*availableOrUnavaliableProduct(id: number, status: string): Promise<Product> {
    return this.productsRepository.availableOrUnavaliableProduct(id, status);
  }*/

  productIsPopular(id: number, status: string): Promise<Product> {
    return this.productsRepository.productIsPopular(id, status);
  }

  async updateImg(
    id: number,
    originalname: string,
    buffer: Buffer,
    contenType: string
  ) {
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

       /* const uploadImg = await this.uploadService.update(
          buffer,
        );*/

        // Handle S3 upload failure
    /*    if (!uploadImg) {
          throw new InternalServerErrorException(
            "Error al cargar imagen a S3."
          );
        }*/

        // Update product's img property with the new URL
        product.img = "on repairing";
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
