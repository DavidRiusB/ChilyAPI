import { Injectable } from "@nestjs/common";
import { OrderDto } from "./dto/order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./entity/order.entity";
import { OrderStatus } from "src/common/enums";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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

  async findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    return await this.orderRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user") // Incluir la relación con el usuario
      .leftJoinAndSelect("order.details", "orderDetail")
      .leftJoinAndSelect("orderDetail.product", "product")
      .skip(offset)
      .take(limit)
      .getMany();
  }

  async findById(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ["user", "details"], // Asegúrate de incluir las relaciones necesarias
    });
  }

  // async findOrdersByUser(userId: number): Promise<Order[]> {
  //   return await this.orderRepository
  //     .createQueryBuilder("order")
  //     .leftJoinAndSelect("order.details", "details")
  //     .leftJoinAndSelect("details.product", "product")
  //     .leftJoinAndSelect("order.address", "address")
  //     .where("order.userId = :userId", { userId })
  //     .select([
  //       "order.id",
  //       "order.date",
  //       "order.price",
  //       "order.couponId",
  //       "order.coupoundDiscount",
  //       "order.total",
  //       "order.status",
  //       "order.orderInstructions",
  //       "order.formBuy",
  //       "details.product",
  //       "details.quantity",
  //       "details.price",
  //       "details.discount",
  //       "details.quantity",
  //       // "product.id",
  //       "product.name",
  //       "product.price",
  //       "address",
  //     ])
  //     .getMany();
  // }
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

  // Mock data (replace with actual database or service calls)
  private orders = [
    { id: 1, branchId: 1 /* other properties */ },
    { id: 2, branchId: 2 /* other properties */ },
    // Add more mock orders as needed
  ];

  // // Mock ID (used for creating new orders)
  // private mockId: number = 3;
  // async findAllOrderByBranchId(
  //   id: number,
  //   pagination: { page: number; limit: number },
  // ) {
  //   const { page, limit } = pagination;
  //   const offset = (page - 1) * limit;

  //   // Placeholder logic: Filter orders by branch ID (assuming id matches branchId in mock data)
  //   const branchOrders = this.orders.filter((order) => order.branchId === id);

  //   return await branchOrders.slice(offset, offset + limit);
  // }
}
