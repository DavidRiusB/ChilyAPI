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

    //metodo para buscar categorias por id y traer sus productos
    async getCategoryById(id: number): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id: id }, relations: ["products"] });
            return category;
        } catch (error) {
            throw new NotFoundException("Error al obtener la categoria");
        }
    }

    //metodo para buscar categorias por nombre y traer sus productos
    async getCategoryByName(name: string): Promise<Category> {
        try {
            name = name.toUpperCase();
            const category = await this.categoryRepository.findOne({ where: { name: name }, relations: ["products"] });
            return category;
        } catch (error) {
            throw new NotFoundException("Error al obtener la categoria o la categoria no existe");
        }
    }

    async createCategory(createCategory: createCategoryDto): Promise<Category> {
        try {
            const category = new Category();
            category.name = createCategory.name.toUpperCase();
            category.description = createCategory.description;
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

            category.description = updateCategory.description;

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