import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { createDiscountDto, updateDiscountDto } from "./dto/createDiscount.dto";
import { DocumentationApiTagsModule } from "src/docs";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enums";

@Controller("discount")
@DocumentationApiTagsModule.clasification("Rutas para: Descuentos")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }

  @Get()
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  getDiscounts() {
    return this.discountService.getDiscounts();
  }

  @Get("valid/:status")
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  getDiscountsByValid(@Param("status") status: string) {
    return this.discountService.getDiscountsByValid(status);
  }

  @Get(":id")
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  getDiscountById(@Param("id") id: number) {
    return this.discountService.getDiscountById(id);
  }

  @Get("code/:code")
  //@UseGuards(JwtAuthGuard)
  getDiscountByCOde(@Param("code")code:string){
    return this.discountService.getDiscountByCode(code);
  }

  @Post("create")
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  creatediscount(@Body() createDiscount: createDiscountDto) {
    return this.discountService.creatediscount(createDiscount);
  }

  @Put("update/:id")
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  updateDiscount(@Param("id") id: number, @Body() updateDiscount: updateDiscountDto) {
    return this.discountService.updateDiscount(id, updateDiscount);
  }

  @Put("invalid")
  //@UseGuards(JwtAuthGuard)
  InvalidDiscount(@Query("code") code: string, @Query("userId") userId: string) {
    return this.discountService.InvalidDiscount(code, userId);
  }

  @Put("setdiscount")
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  setDiscountToUser(@Query("discount") discount: string, @Query("userId") userId: string) {
    return this.discountService.setDiscountToUser(discount, userId);
  }

  @Delete("delete/:id")
  //@Roles(Role.SuperAdmin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  deleteDiscount(@Param("id") id: number) {
    return this.discountService.deleteDiscount(id);
  }
}
