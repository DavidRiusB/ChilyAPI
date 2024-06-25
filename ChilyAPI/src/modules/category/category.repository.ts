import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { createCategoryDto } from "./dto/createCategory.dto";

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) { }

    async getCategories(): Promise<Category[]> {
        try {
            const categories = await this.categoryRepository.find();
            return categories;
        } catch (error) {
            throw new NotFoundException("Error al obtener las categorias");
        }
    }

    //method with pagination to get categories by id
    async getCategoryById(id: number, page:number, limit:number): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id: id }, relations: ["products"] });
            category.products = category.products.slice((page - 1) * limit, page * limit);
            return category;
        } catch (error) {
            throw new NotFoundException("Error al obtener la categoria");
        }
    }

    //method with pagination to get categories by name
    async getCategoryByName(name: string, page:number, limit:number): Promise<Category> {
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
            throw new BadRequestException("Error al crear la categoria posible llave duplicada");
        }
    }

    async updateCategory(id: number, updateCategory: createCategoryDto): Promise<Category> {
        try {
            const category = new Category();

            const existeCategory = await this.categoryRepository.findOne({ where: { id: id } });

            if (!existeCategory) throw new NotFoundException("No existe categoria con ID: " + id);

            category.name = updateCategory.name.toUpperCase();

            category.icon = updateCategory.icon;

            const updatedCategory = await this.categoryRepository.update(id, category);

            return this.categoryRepository.findOne({ where: { id: id } });
        } catch (error) {
            throw new BadRequestException("Error al actualizar la categoria o la Categoria no Existe con ID: " + id);
        }
    }

    async deleteCategory(id: number): Promise<string> {
        try {
            const category = await this.categoryRepository.softDelete(id);
            return category.affected > 0 ? "Categoría eliminada" : "Categoría no encontrada"
        } catch (error) {
            throw new BadRequestException("Error al eliminar la categoria con ID: " + id);
        }
    }
}