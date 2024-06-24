import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { createProductDto } from "./createProduct.dto";
import { Category } from "../category/category.entity";

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>
  ) { }
  async getProducts(page: number, limit: number): Promise<Product[]> {
    let products = await this.productsRepository.find({
      relations: ["category"],
    });
    if (!products)
      throw new NotFoundException("Error al obtener los productos");
    const startIndex = (page - 1) * limit;
    const endIndex = page + limit;

    return products.slice(startIndex, endIndex);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: id },
      relations: ["category"],
    });
    if (!product) throw new NotFoundException("Error al obtener el producto");
    return product;
  }

  async createProduct(createProduct: createProductDto): Promise<Product> {
    try {
      createProduct.category = createProduct.category.toUpperCase();

      const product = new Product();

      const categories = await this.categoryRepository.findOne({
        where: { name: createProduct.category },
      });

      if (!categories) throw new NotFoundException("La categoria no existe");

      product.name = createProduct.name;

      product.description = createProduct.description;

      product.price = createProduct.price;

      product.available = createProduct.available;

      product.img = createProduct.img;

      product.category = categories;

      const createdProduct = this.productsRepository.save(product);

      return createdProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    id: number,
    updateProduct: createProductDto
  ): Promise<Product> {
    try {
      const product = new Product();
      updateProduct.category = updateProduct.category.toUpperCase();
      const category = await this.categoryRepository.findOne({
        where: { name: updateProduct.category },
      });

      if (!category) throw new NotFoundException("La categoria no existe");

      product.name = updateProduct.name;

      product.description = updateProduct.description;

      product.price = updateProduct.price;

      product.available = updateProduct.available;

      product.img = updateProduct.img;

      product.category = category;

      const updatedProduct = await this.productsRepository.update(id,product)
      return await this.getProductById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<string> {
    const product = await this.productsRepository.softDelete(id);
    return product.affected > 0? "Producto eliminado" : "Producto no encontrado";
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    const products = await this.productsRepository
      .createQueryBuilder("product")
      .where("product.id IN (:...ids)", { ids })
      .andWhere("product.available = true")
      .getMany();

    return products;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {

    category = category.toUpperCase();

    const categoryExists = await this.categoryRepository.findOne({
      where: { name: category },
    });

    if (!categoryExists) throw new NotFoundException("La categoria no existe");

    const products = await this.productsRepository.find({
      where: { category: categoryExists },
      relations: ["category"],
    });

    if (!products) throw new NotFoundException("Error al obtener los productos por categoria");

    return products;
  }

  async disableProduct(id: number): Promise<Product> {

    const product = await this.getProductById(id);
    product.available = false;
    await this.productsRepository.update(id,product);

    return await this.getProductById(id);

  }

  async enableProduct(id: number): Promise<Product> {

    const product = await this.getProductById(id);
    product.available = true;
    await this.productsRepository.update(id,product);

    return await this.getProductById(id);

  }
}
