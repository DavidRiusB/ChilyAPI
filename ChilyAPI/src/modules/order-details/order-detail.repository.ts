import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetail } from "./entity/order-details.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderDetailRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>
  ) {}

  async create(orderDetailsData: any[]) {
    const orderDetails =
    this.orderDetailRepository.create(orderDetailsData);
    return orderDetails;
  }
}
