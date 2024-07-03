import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Discount } from "./discount.entity";
import { createDiscountDto, updateDiscountDto } from "./dto/createDiscount.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { LargeNumberLike, randomInt } from "crypto";
import { User } from "../user/entity/user.entity";
import { NotificationEmailsService } from "../notifications/notificationEmails.service";

@Injectable()
export class DiscountRepository {
    constructor(
        @InjectRepository(Discount) private discountRepository: Repository<Discount>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly notificationEmailsService: NotificationEmailsService
    ) { }

    async getDiscounts(): Promise<Discount[]> {
        try {
            const dicounts = await this.discountRepository.find({ where: { isDeleted: false },relations:["user"] })
            return dicounts;
        } catch (error) {
            throw new BadRequestException("Erorr al traer los Descuentos")
        }
    }
    
    async getDiscountsByValid(status: boolean): Promise<Discount[]> {
        try {
            const discounts = await this.discountRepository.find({ where: { isDeleted: false, isValid: status },relations:["user"] })
            return discounts;
        } catch (error) {
            throw new BadRequestException("Erorr al traer los Descuentos por valides")
        }
    }

    async getDiscountById(id: number): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id, isDeleted: false },relations:["user"] })
            return discount;
        } catch (error) {
            throw new BadRequestException("Erorr al traer el Descuento con ID: " + id)
        }
    }

    async creatediscount(createDiscount: createDiscountDto): Promise<Discount> {
        try {
            const discount: Discount = new Discount();
            const codeArray : string[] = [];
            let isValid = false;
            const user: User = await this.userRepository.findOne({where:{id:createDiscount.user}})
            if(!user)throw new BadRequestException("Usuario no encontrado");
            do {
                for (let i: number = 0; i < 15;i++){
                    codeArray[i] = String.fromCharCode(randomInt(65,90));
                }
                const code = codeArray.join("")

                discount.code = code;
                discount.discount = createDiscount.discount;

                const validCode = await this.discountRepository.findOne({ where: { code: code } })
                if(!validCode) isValid = true;
            } while (isValid === false);
            discount.user =user;
            const savedDiscount = await this.discountRepository.save(discount)
            this.notificationEmailsService.sendDiscountCodeEmail(user.email,user.name, discount.discount, discount.code);
            return savedDiscount;
        } catch (error) {
            if(error === BadRequestException) throw error;
            throw new InternalServerErrorException("Error al crear el Descuento")
        }
    }

    async updateDiscount(id: number, updateDiscount: updateDiscountDto): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id, isValid:true} });
            if (!discount) throw new BadRequestException("Error el descuento a modificar ya fue utilizado")
            discount.discount = updateDiscount.discount;
            const updatedDiscount = await this.discountRepository.save(discount);
            return updatedDiscount;
        } catch (error) {
            throw new BadRequestException("Error el descuento a modificar ya fue utilizado")
        }
    }

    async InvalidDiscount(id: number): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id, isValid:true },relations:["user"]})
            if (!discount) throw new BadRequestException("Error al activar/desactivar el Descuento, Verifique los datos enviados")
                discount.isValid = false;
            const updatedDiscount = await this.discountRepository.save(discount);
            this.notificationEmailsService.sendUsedDiscountCodeEmail(discount.user.email, discount.user.name, discount.discount, discount.code);
            return updatedDiscount;
        } catch (error) {
            if (error === BadRequestException) {
                throw new BadRequestException(error.message)
            }
            throw new InternalServerErrorException("Ocurrio un error al desactivar el Descuento")
        }
    }

    async deleteDiscount(id: number): Promise<String> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id } });
            if (!discount) throw new BadRequestException("Error al eliminar el Descuento, Verifique los datos enviados")
            discount.isDeleted = true;
            const deletedDiscount = await this.discountRepository.update(id, discount);
            return deletedDiscount.affected > 0 ? "Descuento dado de baja" : "Descuento no encontrado";
        } catch (error) {
            throw new BadRequestException("Error al eliminar el Descuento, Verifique los datos enviados")
        }
    }
}