import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { createDiscountDto, updateDiscountDto } from "./dto/createDiscount.dto";
import { DocumentationApiTagsModule } from "src/docs";

@Controller("discount")
@DocumentationApiTagsModule.clasification("Rutas para: Descuentos")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }

  @Get()
  getDiscounts() {
    return this.discountService.getDiscounts();
  }

  @Get("valid/:status")
  getDiscountsByValid(@Param("status") status: string) {
    return this.discountService.getDiscountsByValid(status);
  }

  @Get(":id")
  getDiscountById(@Param("id") id: number) {
    return this.discountService.getDiscountById(id);
  }

  @Post("create")
  creatediscount(@Body() createDiscount: createDiscountDto) {
    return this.discountService.creatediscount(createDiscount);
  }

  @Put("update/:id")
  updateDiscount(@Param("id") id: number, @Body() updateDiscount: updateDiscountDto) {
    return this.discountService.updateDiscount(id, updateDiscount);
  }

  @Put("invalid")
  InvalidDiscount(@Query("id") id: string, @Query("userId") userId: string) {
    return this.discountService.InvalidDiscount(id, userId);
  }

  @Put("setdiscount")
  setDiscountToUser(@Query("discount") discount: string, @Query("userId") userId: string) {
    return this.discountService.setDiscountToUser(discount, userId);
  }

  @Delete("delete/:id")
  deleteDiscount(@Param("id") id: number) {
    return this.discountService.deleteDiscount(id);
  }
}
