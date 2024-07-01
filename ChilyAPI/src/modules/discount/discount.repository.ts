import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Discount } from "./discount.entity";
import { createDiscountDto } from "./dto/createDiscount.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { randomInt } from "crypto";

@Injectable()
export class DiscountRepository {
    constructor(
        @InjectRepository(Discount) private discountRepository: Repository<Discount>
    ) { }

    async getDiscounts(): Promise<Discount[]> {
        try {
            const dicounts = await this.discountRepository.find({ where: { isDeleted: false } })
            return dicounts;
        } catch (error) {
            throw new BadRequestException("Erorr al traer los Descuentos")
        }
    }
    
    async getDiscountsByValid(status: boolean): Promise<Discount[]> {
        try {
            const discounts = await this.discountRepository.find({ where: { isDeleted: false, isValid: status } })
            return discounts;
        } catch (error) {
            throw new BadRequestException("Erorr al traer los Descuentos por valides")
        }
    }

    async getDiscountById(id: number): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id, isDeleted: false } })
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

            const savedDiscount = await this.discountRepository.save(discount)
            return savedDiscount;
        } catch (error) {
            throw new BadRequestException("Error al crear el Descuento, Verifique los datos enviados y/o nombre duplicado")
        }
    }

    async updateDiscount(id: number, updateDiscount: createDiscountDto): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id } });
            if (!discount) throw new BadRequestException("Error al modificar el Descuento, Verifique los datos enviados")
            discount.discount = updateDiscount.discount;
            const updatedDiscount = await this.discountRepository.save(discount);
            return updatedDiscount;
        } catch (error) {
            throw new BadRequestException("Error al modificar el Descuento, Verifique los datos enviados")
        }
    }

    async isValidDiscount(id: number, status: string): Promise<Discount> {
        try {
            const discount = await this.discountRepository.findOne({ where: { id: id } })
            if (!discount) throw new Error("Error al activar/desactivar el Descuento, Verifique los datos enviados")
            switch (status) {
                case "true": discount.isValid = true; break;
                case "false": discount.isValid = false; break;
                default: throw new Error("Error al activar/desactivar el Descuento, Verifique los datos enviados")
            }
            const updatedDiscount = await this.discountRepository.save(discount);
            return updatedDiscount;
        } catch (error) {
            throw new BadRequestException(error.message)
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