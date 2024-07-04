import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Or, Repository } from "typeorm";
import { Discount } from "./discount.entity";
import { createDiscountDto, updateDiscountDto } from "./dto/createDiscount.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { LargeNumberLike, randomInt } from "crypto";
import { User } from "../user/entity/user.entity";
import { NotificationEmailsService } from "../notifications/notificationEmails.service";
import { DiscountState } from "src/common/enums/discount-states.enum";

@Injectable()
export class DiscountRepository {
    constructor(
        @InjectRepository(Discount) private discountRepository: Repository<Discount>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly notificationEmailsService: NotificationEmailsService
    ) { }

    async getDiscounts(): Promise<Discount[]> {
        try {
            const dicounts = await this.discountRepository.find({ where: { isValid: DiscountState.CREATED }, relations: ["user"] })
            return dicounts;
        } catch (error) {
            throw new BadRequestException("Erorr al traer los Descuentos")
        }
    }

    async getDiscountsByValid(status: DiscountState): Promise<Discount[]> {
        try {
            const discounts = await this.discountRepository.find({ where: { isValid: status }, relations: ["user"] })
            return discounts;
        } catch (error) {
            throw new BadRequestException("Erorr al traer los Descuentos por valides")
        }
    }

    async getDiscountById(id: number): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({where: [ { id: id, isValid: DiscountState.CREATED },{ id: id, isValid: DiscountState.USED }],relations: ["user"]});
            if(!discount) throw new BadRequestException("Erorr al traer el descuento, verifique los datos")
            return discount;
        } catch (error) {
            if(error instanceof BadRequestException) throw error;
            throw new BadRequestException("Erorr al traer el Descuento con ID: " + id)
        }
    }

    async creatediscount(createDiscount: createDiscountDto): Promise<Discount> {
        try {
            const discount: Discount = new Discount();
            const codeArray: string[] = [];
            let isValid = false;
            do {
                for (let i: number = 0; i < 15; i++) {
                    codeArray[i] = String.fromCharCode(randomInt(65, 90));
                }
                const code = codeArray.join("")

                discount.code = code;
                discount.isValid = DiscountState.CREATED;
                discount.discount = createDiscount.discount;

                const validCode = await this.discountRepository.findOne({ where: { code: code } })
                if (!validCode) isValid = true;
            } while (isValid === false);
            const savedDiscount = await this.discountRepository.save(discount)
            return savedDiscount;
        } catch (error) {
            if (error === BadRequestException) throw error;
            throw new InternalServerErrorException("Error al crear el Descuento")
        }
    }
    async setDiscountToUser(discount: number, userId: number): Promise<Discount> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } })
            if (!user) throw new BadRequestException("Error al encontrar el usuario")
            const existingDiscount = await this.discountRepository.findOne({ where: { id: discount, isValid: DiscountState.CREATED },relations:["user"] })
            existingDiscount.user = user;
            await this.discountRepository.save(existingDiscount)
            this.notificationEmailsService.sendDiscountCodeEmail(user.email, user.name, existingDiscount.discount, existingDiscount.code);
            return existingDiscount;
        } catch (error) {
            if(error instanceof BadRequestException) throw error
            throw new BadRequestException("Error al agregar el descuento al usuario, este descuento ya esta registrado o usado")
        }
    }

    async updateDiscount(id: number, updateDiscount: updateDiscountDto): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id, isValid: DiscountState.CREATED } });
            if (!discount) throw new BadRequestException("Error, el descuento a modificar ya fue utilizado")
            discount.discount = updateDiscount.discount;
            const updatedDiscount = await this.discountRepository.save(discount);
            return updatedDiscount;
        } catch (error) {
            if(error instanceof BadRequestException) throw error
            throw new BadRequestException("Error al modificar el descuento")
        }
    }

    async InvalidDiscount(id: number, userId: number): Promise<Discount> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) throw new BadRequestException("Error al encontrar el usuario");
            const discount = await this.discountRepository.findOne({ where: { id: id, isValid: DiscountState.CREATED },relations:["user"] })
            if (!discount) throw new BadRequestException("Error al utilizar el Descuento, Verifique los datos enviados, el descuento prodria estar usado")

            if (discount.user != null && discount.user.id != userId) throw new BadRequestException("Error al desactivar el descuento, este descuento ya esta registrado a nombre de otro usuario")


            discount.isValid = DiscountState.USED;
            discount.user = user;
            const updatedDiscount = await this.discountRepository.save(discount);
            this.notificationEmailsService.sendUsedDiscountCodeEmail(user.email, user.name, discount.discount, discount.code);
            return updatedDiscount;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            throw new InternalServerErrorException("Ocurrio un error al desactivar el Descuento")
        }
    }

    async deleteDiscount(id: number): Promise<String> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id } });
            if (!discount) throw new BadRequestException("Error al eliminar el Descuento, Verifique los datos enviados")
            discount.isValid = DiscountState.ANNULLED;
            const deletedDiscount = await this.discountRepository.update(id, discount);
            return deletedDiscount.affected > 0 ? "Descuento dado de baja" : "Descuento no encontrado";
        } catch (error) {
            if(error instanceof BadRequestException) throw error
            throw new BadRequestException("Error al eliminar el Descuento, Verifique los datos enviados")
        }
    }
}