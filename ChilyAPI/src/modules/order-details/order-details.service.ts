import { Injectable } from "@nestjs/common";
import { Order } from "../order/entity/order.entity";
import { Product } from "../products/products.entity";
import { OrderDetailRepository } from "./order-detail.repository";
import { OrderDetail } from "./entity/order-details.entity";
import { discountCalculator } from "src/common/middlewares/discountCalculator";
import { ProductsInOrder } from "../order/dto/order.dto";

@Injectable()
export class OrderDetailsService {
  constructor(private readonly orderDetailsRepository: OrderDetailRepository) {}

  async createOrderDetail(
    products: Product[],
    newOrder: Order,
    productsInOrder: ProductsInOrder[],
  ) {
    const orderDetailsData = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productsInOrderInfo = productsInOrder[i];

      const newOrderDetail = new OrderDetail();
      newOrderDetail.order = newOrder;
      newOrderDetail.product = product;
      newOrderDetail.price = productsInOrderInfo.price;
      newOrderDetail.quantity = productsInOrderInfo.quantity;

      // Calculate subtotal (price * quantity)
      let subtotal = newOrderDetail.price * newOrderDetail.quantity;

      // Apply discount if present
      // if (productsInOrderInfo.individualDiscount) {
      //   const discount = productsInOrderInfo.individualDiscount || 0;
      //   subtotal = discountCalculator(subtotal, discount);
      // }

      newOrderDetail.total = subtotal;

      orderDetailsData.push(newOrderDetail);
    }

    try {
      const orderDetails =
        await this.orderDetailsRepository.create(orderDetailsData);
      console.log("Order details created successfully:", orderDetails);
      return orderDetails;
    } catch (error) {
      console.error("Error creating order details:", error);
      throw error;
    }
  }
}
