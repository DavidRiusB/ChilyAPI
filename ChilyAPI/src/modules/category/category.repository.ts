import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { In, Repository } from "typeorm";
import { createCategoryDto, UpdateCategoryDTO } from "./dto/createCategory.dto";

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) { }

    async getCategories(): Promise<Category[]> {
        try {
            const categories = await this.categoryRepository.find({ relations: ["products"] });
            return categories;
        } catch (error) {
            throw new NotFoundException("Error al obtener las categorias");
        }
    }

    //method with pagination to get categories with their products by id
    async getCategoryById(id: number[], page: number = 1, limit: number = 10): Promise<Category[]> {
        try {
            const categories = await this.categoryRepository.find({
                where: { id: In(id) },
                relations: ["products"],
            });

            if (!categories || categories.length === 0) {
                throw new NotFoundException('Una o más categorías no existen o están eliminadas');
            }

            categories.forEach(category => {
                category.products = category.products.slice((page - 1) * limit, page * limit);
            });

            return categories;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(error);
        }
    }

    async getCategoryById2(id: number, page: number, limit: number): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id: id }, relations: ["products"] });
            category.products = category.products.slice((page - 1) * limit, page * limit);
            return category;
        } catch (error) {
            throw new NotFoundException("Error al obtener la categoria");
        }
    }

    //method with pagination to get categories with their products by name
    async getCategoryByName(name: string, page: number, limit: number): Promise<Category> {
        try {
            name = name.toUpperCase();
            const category = await this.categoryRepository.findOne({ where: { name: name }, relations: ["products"] });
            category.products = category.products.slice((page - 1) * limit, page * limit);
            return category;
        } catch (error) {
            throw new NotFoundException("Error al obtener la categoria o la categoria no existe");
        }
    }

    async createCategory(createCategory: createCategoryDto): Promise<Category> {
        try {
            const category = new Category();

            category.name = createCategory.name.toUpperCase();

            category.icon = createCategory.icon;

            const savedCategory = await this.categoryRepository.save(category);

            return savedCategory;
        } catch (error) {
            throw new BadRequestException("Error al crear la categoria o posible nombre duplicado");
        }
    }

    async updateCategory(id: number, updateCategory: UpdateCategoryDTO): Promise<Category> {
        try {

            const existeCategory = await this.categoryRepository.findOne({ where: { id: id } });

            existeCategory.name = updateCategory.name.toUpperCase();

            existeCategory.icon = updateCategory.icon;

            const updatedCategory = await this.categoryRepository.save(existeCategory);

            return updatedCategory;
        } catch (error) {
            throw new BadRequestException("Error al actualizar la categoria o la Categoria no Existe con ID: " + id);
        }
    }

    async deleteCategory(id: number): Promise<string> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id: id } });
            this.categoryRepository.softDelete(category.id);
            return `La categoria con ID: ${id} ha sido eliminada`;
        } catch (error) {
            throw new BadRequestException("Error al eliminar la categoria con ID: " + id);
        }
    }
}