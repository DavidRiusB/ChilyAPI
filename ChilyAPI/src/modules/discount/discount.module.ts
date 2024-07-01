import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Discount } from "./discount.entity";
import { DiscountController } from "./discount.controller";
import { DiscountService } from "./discount.service";
import { DiscountRepository } from "./discount.repository";


@Module({
    imports: [TypeOrmModule.forFeature([Discount])],
    controllers: [DiscountController],
    providers: [DiscountService, DiscountRepository],
})
export class DiscountModule {}