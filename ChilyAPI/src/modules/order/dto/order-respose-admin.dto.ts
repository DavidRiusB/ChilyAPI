import { OrderStatus } from "src/common/enums";

export class OrderResponseDto {
  id: string;
  price: string;
  date: string;
  status: OrderStatus;
  products: { name: string; quantity: number; price: string }[];
}
