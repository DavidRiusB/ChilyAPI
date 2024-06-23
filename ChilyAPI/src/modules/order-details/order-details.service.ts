import { Injectable } from "@nestjs/common";
import { Order } from "../order/entity/order.entity";
import { Product } from "../products/products.entity";
import { OrderDetailRepository } from "./order-detail.repository";//
import { OrderDetail } from "./entity/order-details.entity";

@Injectable()
export class OrderDetailsService {
  constructor(private readonly orderDetailsRepository: OrderDetailRepository) {}

  async createOrderDetail(
    products: Product[],
    newOrder: Order,
    productsInOrder
  ) {
    console.log("products in service", products);
    const orderDetailsData = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productsinOrderInfo = productsInOrder[i];

      const newOrderDetail = new OrderDetail();
      newOrderDetail.order = newOrder;
      newOrderDetail.product = product;
      newOrderDetail.price = product.price; //? probabli change this so it respect the USER price insted of db price
      newOrderDetail.discount = productsinOrderInfo.discount;

      newOrderDetail.quantity = productsinOrderInfo.quantity;
      //!Calculate prices and stuf!!!!!
      orderDetailsData.push(newOrderDetail);
    }
    const orderDetails =
      await this.orderDetailsRepository.create(orderDetailsData);
    return orderDetails;
  }
}
