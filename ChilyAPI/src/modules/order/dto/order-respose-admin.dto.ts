import { OrderStatus } from "src/common/enums";
import { User } from "src/modules/user/entity/user.entity";

export class OrderResponseDto {
  id: string;
  price: string;
  date: string;
  status: OrderStatus;
  products: { name: string; quantity: number; price: string }[];
  email: string;
}
