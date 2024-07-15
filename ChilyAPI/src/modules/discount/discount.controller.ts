import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { createDiscountDto, updateDiscountDto } from "./dto/createDiscount.dto";
import {
  DocumentationApiTagsModule,
  DocumentationCreateDiscount,
  DocumentationDeleteDiscount,
  DocumentationGetDiscountByCode,
  DocumentationGetDiscountById,
  DocumentationGetDiscounts,
  DocumentationGetDiscountsByValid,
  DocumentationInvalidDiscount,
  DocumentationSetDiscountToUser,
  DocumentationUpdateDiscount
} from "src/docs";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums";

@Controller("discount")
@DocumentationApiTagsModule.clasification("Rutas para: Descuentos")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  @DocumentationGetDiscounts()
  getDiscounts() {
    return this.discountService.getDiscounts();
  }

  @Get("valid/:status")
  @DocumentationGetDiscountsByValid()
  getDiscountsByValid(@Param("status") status: string) {
    return this.discountService.getDiscountsByValid(status);
  }

  @Get(":id")
  @DocumentationGetDiscountById()
  getDiscountById(@Param("id") id: number) {
    return this.discountService.getDiscountById(id);
  }

  @Get("code/:code")
  @DocumentationGetDiscountByCode()
  getDiscountByCOde(@Param("code") code: string) {
    return this.discountService.getDiscountByCode(code);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.SuperAdmin)
  @DocumentationCreateDiscount()
  creatediscount(@Body() createDiscount: createDiscountDto) {
    return this.discountService.creatediscount(createDiscount);
  }

  @Put("update/:id")
  @DocumentationUpdateDiscount()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.SuperAdmin)
  updateDiscount(
    @Param("id") id: number,
    @Body() updateDiscount: updateDiscountDto
  ) {
    return this.discountService.updateDiscount(id, updateDiscount);
  }

  @Put("invalid")
  @UseGuards(JwtAuthGuard)
  @DocumentationInvalidDiscount()
  InvalidDiscount(
    @Query("code") code: string,
    @Query("userId") userId: string
  ) {
    return this.discountService.InvalidDiscount(code, userId);
  }

  @Put("setdiscount")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.SuperAdmin)
  @DocumentationSetDiscountToUser()
  setDiscountToUser(
    @Query("discount") discount: string,
    @Query("userId") userId: string
  ) {
    return this.discountService.setDiscountToUser(discount, userId);
  }

  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.SuperAdmin)
  @DocumentationDeleteDiscount()
  deleteDiscount(@Param("id") id: number) {
    return this.discountService.deleteDiscount(id);
  }
}
