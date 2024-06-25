import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { createCategoryDto } from './dto/createCategory.dto';
import { DocumentationAddCategory, DocumentationApiTagsModule } from 'src/docs';

@Controller('category')
@DocumentationApiTagsModule.clasification('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get('name/:name')
  getCategoryByName(@Param('name') name: string) {
    return this.categoryService.getCategoryByName(name);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Post('create')
  @DocumentationAddCategory()
  createCategory(@Body() createCategoryDto: createCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Put('update/:id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: createCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete('delete/:id')
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
