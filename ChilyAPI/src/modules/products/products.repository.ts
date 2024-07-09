import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Between, DataSource, In, Raw, Repository } from "typeorm";
import { Product } from "./products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { createProductDto, UpdateProductDto } from "./createProduct.dto";
import { Category } from "../category/category.entity";
import { CategoryService } from "../category/category.service";

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource,
    private readonly categoryService: CategoryService
  ) { }
  async getProducts(page: number, limit: number): Promise<Product[]> {
    try {
      let products = await this.productsRepository.find({
        where: { isDeleted: false },
        relations: ["category"],
      });

      if (page != 0 && limit != 0) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        return products.slice(startIndex, endIndex);
      }else{
        return products;
      }

    } catch (error) {
      throw new NotFoundException("Error al obtener los productos");
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find({ where: { isDeleted: false } });
      return products;
    } catch (error) {
      throw new NotFoundException("Error al obtener los productos");
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id: id, isDeleted: false },
        relations: ["category"],
      });
      return product;
    } catch (error) {
      throw new NotFoundException("Error al obtener el producto");
    }
  }

  async getCategoryByFilter(filter: number[]): Promise<Product[]> {
    try {
      const categories = await this.categoryRepository.find({
        where: { id: In(filter), isDeleted: false },
        relations: ['products'],
      });

      let products: Product[] = [];
      categories.forEach(category => {
        category.products.forEach(product => {
          if (!product.isDeleted) {
            products.push(product);
          }
        });
      });

      products = Array.from(new Set(products.map(p => p.id))).map(id => {
        return products.find(p => p.id === id);
      });

      return products;
    } catch (error) {
      throw new NotFoundException("Error al obtener las categorias");
    }
  }

  async getProductsBySearch(search: string): Promise<Product[]> {
    try {

      const upperSearch = search.toUpperCase();

      const productsByName = await this.productsRepository.find({
        where: {
          name: Raw(alias => `UPPER(${alias}) LIKE UPPER(:search)`, { search: `%${upperSearch}%` }),
          isDeleted: false,
        },
        relations: ["category"],
      });

      const productsByDescription = await this.productsRepository.find({
        where: {
          description: Raw(alias => `UPPER(${alias}) LIKE UPPER(:search)`, { search: `%${upperSearch}%` }),
          isDeleted: false,
        },
        relations: ["category"],
      })

      let products = productsByName.concat(productsByDescription);

      products = Array.from(new Set(products.map(p => p.id))).map(id => {
        return products.find(p => p.id === id);
      });
      return products;
    } catch (error) {
      throw new NotFoundException("Error al obtener los productos");
    }
  }

  /*async getProductsByFilter(filter: number[], search: string, min: number, max: number, page: number, limit: number): Promise<Product[]> {
    try {
      const products = await this.getProducts(page, limit);
      if(filter);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al obtener los productos');
    }
  }*/

  async getProductsByPriceRange(min: number, max: number): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find({
        where: { isDeleted: false, price: Between(min, max) },
        relations: ["category"],
      });
      return products;
    } catch (error) {
      throw new NotFoundException("Error al obtener los productos");
    }
  }

  async createProduct(createProduct: createProductDto): Promise<Product> {
    try {

      return this.dataSource.transaction(async(manager) => {       
        const product = new Product();
  
        product.name = createProduct.name;
  
        product.description = createProduct.description;
  
        product.price = createProduct.price;
  
        product.stock = createProduct.stock;
  
        product.img = createProduct.imageURL;
  
        product.isPopular = createProduct.isPopular;

        const categories: Category[] = await this.categoryService.getCategoryById(createProduct.category);
        product.category = categories;
  
        await manager.save(product);
        return product;
      })
    } catch (error) {
      if(error instanceof NotFoundException) throw error;
      if(error.code === '23505') throw new ConflictException("Error al crear el producto o posible nombre duplicado");
      throw new InternalServerErrorException("Error inesperado del servidor al crear el producto");
    }
  }

  async updateProduct(id: number, updateProduct: UpdateProductDto): Promise<Product> {
    try {

      return this.dataSource.transaction(async(manager) => {
        const product = await this.getProductById(id);

        product.name = updateProduct.name;

        product.description = updateProduct.description;
  
        product.price = updateProduct.price;

        product.stock = Math.max(product.stock + updateProduct.stock, 0);

        product.img = updateProduct.imageURL;
  
        if (updateProduct.category.length > 0) {
          const categories = await this.categoryService.getCategoryById(updateProduct.category);
          product.category = categories;
        }
  
        await manager.save(product);
  
        return product;
      })
    } catch (error) {
      if(error instanceof NotFoundException)throw error;
      throw new NotFoundException("Error al actualizar el producto con ID: " + id);
    }
  }

  async deleteProduct(id: number): Promise<string> {
    try {
      const product = await this.productsRepository.findOne({ where: { id: id } });
      if(!product) throw new NotFoundException("Producto no encontrado")
      product.isDeleted = true;
      const updatedProduct = await this.productsRepository.update(id, product);
      return updatedProduct.affected > 0 ? "Producto dado de baja" : "Producto no encontrado";
    } catch (error) {
      if(error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Error al dar de baja el producto con ID: " + id);
    }
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    const products = await this.productsRepository
      .createQueryBuilder("product")
      .where("product.id IN (:...ids)", { ids })
      .getMany();

    return products;
  }
  /*async availableOrUnavaliableProduct(id: number, status: string): Promise<Product> {

    try {
      const product = await this.productsRepository.findOne({ where: { id: id, isDeleted: false }, relations: ["category"] });

      if (!product) throw new NotFoundException("Error al obtener el producto");

      if (status === "true") {
        product.available = true;
      } else if (status === "false") {
        product.available = false;
      } else {
        throw new BadRequestException("El estado debe ser true o false")
      };

      await this.productsRepository.save(product);
      return product;

    } catch (error) {
      throw new NotFoundException("Error al actualizar el producto con ID: " + id);
    }
  }*/

  async productIsPopular(id: number, status: string): Promise<Product> {
    try {
      const product = await this.getProductById(id);
     status ? product.isPopular = true : product.isPopular = false;
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      if(error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Error al actualizar el producto con ID: " + id);
    }
  }
}
