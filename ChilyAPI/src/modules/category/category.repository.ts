import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";//
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
        const category = await this.categoryRepository.save(createCategory);
        if(!category) throw new Error("Error al crear la categoria");
        return category;
    }

    async updateCategory(id: number, updateCategory: createCategoryDto): Promise<Category>{
        const updatedCategory = await this.categoryRepository.update(id, updateCategory);
        if(!updatedCategory) throw new Error("Error al actualizar la categoria con ID: "+id);
        return this.categoryRepository.findOne({where:{id:id}});
    }

    async deleteCategory(id: number): Promise<string>{
        const category = await this.getCategoryById(id);
        await this.categoryRepository.delete({id:id});
        return "Categoría: "+category.name+" con ID: "+id+" ha sido eliminada correctamente";
    }
}