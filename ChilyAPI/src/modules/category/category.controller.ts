import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { createCategoryDto } from './dto/createCategory.dto';
import { DocumentationAddCategory, DocumentationApiTagsModule } from 'src/docs';
import { QueryInterceptor } from 'src/common/interceptors/query.interceptor';

@Controller('category')
@DocumentationApiTagsModule.clasification('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get('name/:name')
  @UseInterceptors(QueryInterceptor)
  getCategoryByName(@Req() request: any,@Param('name') name: string) {
    return this.categoryService.getCategoryByName(name,request.page,request.limit);
  }

  @Get(':id')
  @UseInterceptors(QueryInterceptor)
  getCategoryById(@Req() request: any,@Param('id') id: number) {
    return this.categoryService.getCategoryById(id,request.page,request.limit);
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
