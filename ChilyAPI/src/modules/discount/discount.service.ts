import { BadRequestException, Injectable } from "@nestjs/common";
import { DiscountRepository } from "./discount.repository";
import { createDiscountDto } from "./dto/createDiscount.dto";
import { Discount } from "./discount.entity";

@Injectable()
export class DiscountService {
    constructor(private readonly discountRepository: DiscountRepository){}
    getDiscounts(): Promise<Discount[]>{
        return this.discountRepository.getDiscounts();
    }
    getDiscountsByValid(status: string): Promise<Discount[]>{
        status.toLowerCase();
        let statusBoolean:boolean;
        switch(status){
            case "true":statusBoolean = true;break;
            case "false":statusBoolean = false;break;
            default:
                throw new BadRequestException("Estado enviado debe ser verdadero o falso");break;
        }
        return this.discountRepository.getDiscountsByValid(statusBoolean);
    }

    getDiscountById(id: number): Promise<Discount>{
        return this.discountRepository.getDiscountById(id);
    }

    creatediscount(createDiscount: createDiscountDto): Promise<Discount>{
        return this.discountRepository.creatediscount(createDiscount);
    }

    updateDiscount(id: number, updateDiscount: createDiscountDto): Promise<Discount>{
        return this.discountRepository.updateDiscount(id, updateDiscount);
    }

    isValidDiscount(id: number, status: string): Promise<Discount>{
        return this.discountRepository.isValidDiscount(id, status);
    }

    deleteDiscount(id: number): Promise<String>{
        return this.discountRepository.deleteDiscount(id);
    }

}