import { Address } from "src/modules/addresses/entities/addresses.entity";
import { ProductsInOrder } from "./order.dto";
import { OrderStatus } from "src/common/enums";


export class ResOrderDto {

  id: number;
  address: Address;
  details: ProductsInOrder[];
  formBuy: "efectivo" | "tarjeta";
  total: number;
  status: OrderStatus;
  date: Date;

}
