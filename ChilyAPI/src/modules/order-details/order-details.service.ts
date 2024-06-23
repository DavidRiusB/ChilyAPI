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
    productsInOrder: ProductsInOrder[]
  ) {
    /* console.log("products in service", products);
    console.log("productsInOrder in service", productsInOrder); */
    const orderDetailsData = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productsinOrderInfo = productsInOrder[i];
      /* console.log(`Product ${i} details:`, productsinOrderInfo); */

      const newOrderDetail = new OrderDetail();
      newOrderDetail.order = newOrder;
      newOrderDetail.product = product;
      newOrderDetail.price = productsinOrderInfo.individualPrice;
      newOrderDetail.quantity = productsinOrderInfo.quantity;

      const discount = productsinOrderInfo.individualDiscount || 0;

      newOrderDetail.total =
        discountCalculator(discount, productsinOrderInfo.individualPrice) *
        productsinOrderInfo.quantity;

      orderDetailsData.push(newOrderDetail);
    }

    try {
      const orderDetails =
        await this.orderDetailsRepository.create(orderDetailsData);
      console.log("Order details created successfully:", orderDetails);
      return orderDetails;
    } catch (error) {
      console.error("Error creating order details:", error);
      throw error; // Re-throw the error after logging it
    }
  }
}
