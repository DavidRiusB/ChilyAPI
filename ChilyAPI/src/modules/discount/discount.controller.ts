import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { createDiscountDto } from "./dto/createDiscount.dto";

@Controller("discount")
export class DiscountController {
    constructor(
        private readonly discountService: DiscountService,
    ) {}

    @Get()
    getDiscounts(){
        return this.discountService.getDiscounts();
    }

    @Get("valid/:status")
    getDiscountsByValid(@Param("status") status:string){
        return this.discountService.getDiscountsByValid(status);
    }

    @Get(":id")
    getDiscountById(@Param("id") id:number){
        return this.discountService.getDiscountById(id);
    }

    @Post("create")
    creatediscount(@Body() createDiscount: createDiscountDto){
        return this.discountService.creatediscount(createDiscount);
    }

    @Put("update/:id")
    updateDiscount(@Param("id") id:number, @Body() updateDiscount: createDiscountDto){
        return this.discountService.updateDiscount(id, updateDiscount);
    }

    @Put("valid")
    isValidDiscount(@Query("id") id:number, @Query("status") status:string){
        return this.discountService.isValidDiscount(id, status);
    }

    @Delete("delete/:id")
    deleteDiscount(@Param("id") id:number){
        return this.discountService.deleteDiscount(id);
    }

}