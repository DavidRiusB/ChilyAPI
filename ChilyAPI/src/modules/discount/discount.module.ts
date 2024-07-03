import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Discount } from "./discount.entity";
import { DiscountController } from "./discount.controller";
import { DiscountService } from "./discount.service";
import { DiscountRepository } from "./discount.repository";
import { User } from "../user/entity/user.entity";
import { NotificationEmailsService } from "../notifications/notificationEmails.service";


@Module({
    imports: [TypeOrmModule.forFeature([Discount,User])],
    controllers: [DiscountController],
    providers: [DiscountService, DiscountRepository, NotificationEmailsService],
})
export class DiscountModule {}