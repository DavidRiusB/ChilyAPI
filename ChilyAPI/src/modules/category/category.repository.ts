import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { createCategoryDto } from "./dto/createCategory.dto";

@Injectable()
export class CategoryRepository{
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ){}

    async getCategories(): Promise<Category[]>{
        const categories = await this.categoryRepository.find();
        if(!categories) throw new Error("Error al obtener las categorias");
        return categories;
    }

    async getCategoryById(id: number): Promise<Category>{
        const category = await this.categoryRepository.findOne({where:{id:id}});
        if(!category) throw new Error("Error al obtener la categoria");
        return category;
    }

    async createCategory(createCategory: createCategoryDto): Promise<Category>{
        const category = new Category();
        category.name = createCategory.name.toUpperCase();
        category.description = createCategory.description;
        const savedCategory = await this.categoryRepository.save(category);
        if(!savedCategory) throw new Error("Error al crear la categoria");
        return savedCategory;
    }

    async updateCategory(id: number, updateCategory: createCategoryDto): Promise<Category>{
        const category = new Category();
        category.name = updateCategory.name.toUpperCase();
        category.description = updateCategory.description;
        const updatedCategory = await this.categoryRepository.update(id, category);
        if(!updatedCategory) throw new Error("Error al actualizar la categoria con ID: "+id);
        return this.categoryRepository.findOne({where:{id:id}});
    }

    async deleteCategory(id: number): Promise<string>{
        const category = await this.categoryRepository.softDelete(id);
        return category.affected > 0? "Categoría eliminada" : "Categoría no encontrada"
    }
}