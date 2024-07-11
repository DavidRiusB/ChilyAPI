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
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";
import { createCategoryDto } from "./dto/createCategory.dto";
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
import { Role } from "src/common/enums";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

@Controller("category")
@DocumentationApiTagsModule.clasification("Rutas para: Categorías")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @DocumentationGetCategories()
  getCategories() {
    return this.categoryService.getCategories();
  }

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
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  createCategory(@Body() createCategoryDto: createCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Put("update/:id")
  @DocumentationUpdateCategory()
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  updateCategory(
    @Param("id") id: number,
    @Body() updateCategoryDto: createCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete("delete/:id")
  @DocumentationDeleteCategory()
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  deleteCategory(@Param("id") id: number) {
    return this.categoryService.deleteCategory(id);
  }


}
