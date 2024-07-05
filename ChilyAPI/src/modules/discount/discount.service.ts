import { BadRequestException, Injectable } from "@nestjs/common";
import { DiscountRepository } from "./discount.repository";
import { createDiscountDto, updateDiscountDto } from "./dto/createDiscount.dto";
import { Discount } from "./discount.entity";
import { DiscountState } from "src/common/enums/discount-states.enum";

@Injectable()
export class DiscountService {
    constructor(private readonly discountRepository: DiscountRepository){}
    getDiscounts(): Promise<Discount[]>{
        return this.discountRepository.getDiscounts();
    }
    getDiscountsByValid(status: string): Promise<Discount[]>{
        const aux = status.toUpperCase();
        let statusBoolean:DiscountState;
        switch(aux){
            case "CREATED":statusBoolean = DiscountState.CREATED;break;
            case "USED":statusBoolean = DiscountState.USED;break;
            default:
                throw new BadRequestException("Estado enviado debe ser CREATED o USED");break;
        }
        return this.discountRepository.getDiscountsByValid(statusBoolean);
    }

    getDiscountById(id: number): Promise<Discount>{
        return this.discountRepository.getDiscountById(id);
    }

    setDiscountToUser(discount: string, userId: string): Promise<Discount>{
        return this.discountRepository.setDiscountToUser(Number(discount), Number(userId));
    }

    creatediscount(createDiscount: createDiscountDto): Promise<Discount>{
        return this.discountRepository.creatediscount(createDiscount);
    }

    updateDiscount(id: number, updateDiscount: updateDiscountDto): Promise<Discount>{
        return this.discountRepository.updateDiscount(id, updateDiscount);
    }

    InvalidDiscount(code: string, userId:string): Promise<Discount>{
        if(!code || !userId) throw new BadRequestException("Verifique los datos enviados, no se permiten campos vacios")
        if(code.length != 15)throw new BadRequestException("Verifique los datos enviados");
        return this.discountRepository.InvalidDiscount(code.toUpperCase(),Number(userId));
    }

    deleteDiscount(id: number): Promise<String>{
        return this.discountRepository.deleteDiscount(id);
    }

}