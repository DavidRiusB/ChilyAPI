import {
  Injectable,
} from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { Product } from "./products.entity";
import { createProductDto, UpdateProductDto } from "./createProduct.dto";

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
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

  createProduct(createProduct: createProductDto): Promise<Product> {
    return this.productsRepository.createProduct(createProduct);
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

}
