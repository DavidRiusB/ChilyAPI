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
  ) {}
  async getProducts(page: number, limit: number): Promise<Product[]> {
    let products = await this.productsRepository.find({
      relations: ["Category"],
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
      relations: ["Category"],
    });
    if (!product) throw new NotFoundException("Error al obtener el producto");
    return product;
  }

  async createProduct(createProduct: createProductDto): Promise<Product> {
    try {
      const createdProduct = new Product();

      const categories = await this.categoryRepository.findOne({
        where: { name: createProduct.category },
      });

      if (!categories) throw new NotFoundException("La categoria no existe");

      createdProduct.name = createProduct.name;

      createdProduct.description = createProduct.description;

      createdProduct.price = createProduct.price;

      createdProduct.available = createProduct.available;

      createdProduct.img = createProduct.img;

      createdProduct.category = categories;

      const product = this.productsRepository.save(createdProduct);

      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    id: number,
    updateProduct: createProductDto
  ): Promise<Product> {
    try {
      const updatedProduct = new Product();

      const categories = await this.categoryRepository.findOne({
        where: { name: updateProduct.category },
      });

      if (!categories) throw new NotFoundException("La categoria no existe");

      updatedProduct.name = updateProduct.name;

      updatedProduct.description = updateProduct.description;

      updatedProduct.price = updateProduct.price;

      updatedProduct.available = updateProduct.available;

      updatedProduct.category = categories;

      await this.productsRepository.update(id, updatedProduct);

      return await this.getProductById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<string> {
    /* IMPLEMENTAR METODO SOFTDELETE */
    const product = await this.getProductById(id);
    await this.productsRepository.delete(id);
    return (
      "Producto: " +
      product.name +
      " con id: " +
      id +
      " ha sido eliminado exitosamente"
    );
  }

  async findByIds(ids: number[]) {
    const products = await this.productsRepository
      .createQueryBuilder("product")
      .select([
        "product.id",
        "product.name",
        "product.price",
        "product.image_url",
      ])
      .where("product.id IN (:...ids)", { ids })
      .andWhere("product.available === true")
      .getMany();

    return products;
  }
}
