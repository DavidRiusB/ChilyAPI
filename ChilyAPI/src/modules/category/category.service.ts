import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';
import { createCategoryDto } from '../dto/createCategory.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    getCategories(): Promise<Category[]>{
        return this.categoryRepository.getCategories();
    }

    getCategoryById(id:number): Promise<Category>{
        return this.categoryRepository.getCategoryById(id);
    }

    createCategory(createCategory : createCategoryDto): Promise<Category>{
        return this.categoryRepository.createCategory(createCategory);
    }

    updateCategory(id : number,updateCategory : createCategoryDto): Promise<Category>{
        return this.categoryRepository.updateCategory(id,updateCategory);
    }

    deleteCategory(id:number): Promise<string>{
        return this.categoryRepository.deleteCategory(id);
    }
}
