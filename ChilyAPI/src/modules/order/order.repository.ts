import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { OrderDto } from "./dto/order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./entity/order.entity";
import { OrderStatus } from "src/common/enums";
import { Product } from "../products/products.entity";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) {}

  async create(orderDto): Promise<Order> {
    const {
      userId,
      address,
      total,
      couponId,
      couponDiscount,
      formBuy,
      orderInstructions,
    } = orderDto;

    const newOrder = new Order(); // Ensure proper initialization of 'id'

    // Set other properties
    newOrder.user = userId;
    newOrder.date = new Date();
    newOrder.couponId = couponId;
    newOrder.couponDiscount = couponDiscount;
    newOrder.orderInstructions = orderInstructions;
    newOrder.address.id = address.id;
    newOrder.formBuy = formBuy;
    newOrder.price = total;
    // Calculate total based on price, discounts, etc.
    newOrder.total = total; // Or set total after calculation

    return await this.orderRepository.save(newOrder); // Save the new order
  }

  async findAll(
    pagination: { page: number; limit: number },
    filters: {
      email?: string;
      id?: string;
      date?: string;
      productName?: string;
      price?: string;
      status?: OrderStatus;
    },
  ) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    let query = this.orderRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.details", "orderDetail")
      .leftJoinAndSelect("orderDetail.product", "product")
      .skip(offset)
      .take(limit);

    if (filters.email) {
      query = query.andWhere("user.email = :email", { email: filters.email });
    }
    if (filters.id) {
      query = query.andWhere("order.id = :id", { id: filters.id });
    }
    if (filters.date) {
      query = query.andWhere("order.date = :date", { date: filters.date });
    }
    if (filters.productName) {
      query = query.andWhere("product.name = :productName", {
        productName: filters.productName,
      });
    }
    if (filters.price) {
      query = query.andWhere("order.price = :price", { price: filters.price });
    }
    if (filters.status) {
      query = query.andWhere("order.status = :status", {
        status: filters.status,
      });
    }

    return await query.getMany();
  }

  async findById(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ["user", "details"],
    });
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return await this.orderRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.details", "details")
      .leftJoinAndSelect("details.product", "product")
      .leftJoinAndSelect("order.address", "address")
      .where("order.userId = :userId", { userId })
      .select([
        "order.id",
        "order.date",
        "order.price",
        "order.total",
        "order.status",
        "order.formBuy",
        "product.name",
        "details.quantity",
        "details.price",
        "address",
      ])
      .getMany();
  }

  async updateStatus(order: Order, newStatus: OrderStatus) {
    order.status = newStatus;
    const updatedOrder = await this.orderRepository.update(order.id, {
      status: newStatus,
    });
    return updatedOrder;
  }

}
