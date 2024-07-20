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
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";
import { createCategoryDto, UpdateCategoryDTO } from "./dto/createCategory.dto";
import {
  DocumentationApiTagsModule,
  DocumentationCreateCategory,
  DocumentationDeleteCategory,
  DocumentationGetCategories,
  DocumentationGetCategoryById,
  DocumentationGetCategoryByName,
  DocumentationUpdateCategory,
} from "src/docs";
import { QueryInterceptor } from "src/common/interceptors/query.interceptor";
import { Throttle } from "@nestjs/throttler";

@Controller("category")
@DocumentationApiTagsModule.clasification("Rutas para: Categorías")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Throttle({
    default: {
      limit: 5,
      ttl: 60
    }
  })
  @Get()
  @DocumentationGetCategories()
  getCategories() {
    return this.categoryService.getCategories();
  }
  @Throttle({
    default: {
      limit: 5,
      ttl: 60
    }
  })
  @Get("name/:name")
  @DocumentationGetCategoryByName()
  @UseInterceptors(QueryInterceptor)
  getCategoryByName(@Req() request: any, @Param("name") name: string) {
    return this.categoryService.getCategoryByName(
      name,
      request.page,
      request.limit,
    );
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60
    }
  })
  @Get(":id")
  @DocumentationGetCategoryById()
  @UseInterceptors(QueryInterceptor)
  getCategoryById(@Req() request: any, @Param("id") id: number) {
    return this.categoryService.getCategoryById2(
      id,
      request.page,
      request.limit,
    );
  }

  @Post("create")
  @DocumentationCreateCategory()
  createCategory(@Body() createCategoryDto: createCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Put("update/:id")
  @DocumentationUpdateCategory()
  updateCategory(
    @Param("id") id: number,
    @Body() updateCategoryDto: UpdateCategoryDTO,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete("delete/:id")
  @DocumentationDeleteCategory()
  deleteCategory(@Param("id") id: number) {
    return this.categoryService.deleteCategory(id);
  }


}
