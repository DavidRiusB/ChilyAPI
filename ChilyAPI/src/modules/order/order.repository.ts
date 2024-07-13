import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { OrderDto } from "./dto/order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./entity/order.entity";
import { OrderStatus } from "src/common/enums";
import { Product } from "../products/products.entity";

interface OrderPagination {
  page: number;
  limit: number;
}

interface OrderFilters {
  email?: string;
  id?: string;
  date?: string;
  productName?: string;
  status?: OrderStatus;
}
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
    newOrder.price = parseFloat(total.toFixed(2));

    // Calculate total based on price, discounts, etc.
    newOrder.total = parseFloat(total.toFixed(2));
    return await this.orderRepository.save(newOrder);
  }

  async findAll(
    pagination: { page: number; limit: number },
    filters: {
      email?: string;
      id?: string;
      date?: string;
      productName?: string;
      status?: OrderStatus;
    },
  ) {
    const { page, limit } = pagination;

    let query = this.orderRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.details", "orderDetail")
      .leftJoinAndSelect("orderDetail.product", "product")
      .orderBy("order.date", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (filters.email) {
      query = query.andWhere("LOWER(user.email) LIKE LOWER(:email)", {
        email: `%${filters.email}%`,
      });
    }
    if (filters.id) {
      query = query.andWhere("order.id = :id", { id: filters.id });
    }
    if (filters.date) {
      const dateParts = filters.date.split("-");
      if (dateParts.length === 1) {
        // Only year is provided
        query = query.andWhere('EXTRACT(YEAR FROM "order".date) = :year', {
          year: dateParts[0],
        });
      } else if (dateParts.length === 2) {
        // Year and month are provided
        query = query.andWhere(
          'EXTRACT(YEAR FROM "order".date) = :year AND EXTRACT(MONTH FROM "order".date) = :month',
          {
            year: dateParts[0],
            month: dateParts[1],
          },
        );
      } else if (dateParts.length === 3) {
        // Year, month, and day are provided
        query = query.andWhere(
          'EXTRACT(YEAR FROM "order".date) = :year AND EXTRACT(MONTH FROM "order".date) = :month AND EXTRACT(DAY FROM "order".date) = :day',
          {
            year: dateParts[0],
            month: dateParts[1],
            day: dateParts[2],
          },
        );
      }
    }
    if (filters.productName) {
      query = query.andWhere("LOWER(product.name) LIKE LOWER(:productName)", {
        productName: `%${filters.productName}%`,
      });
    }
    if (filters.status) {
      query = query.andWhere("order.status = :status", {
        status: filters.status,
      });
    }

    const orders = await query.getMany();
    return orders;
  }

  async countOrders(filters: {
    email?: string;
    id?: string;
    date?: string;
    productName?: string;
    status?: OrderStatus;
  }): Promise<number> {
    let query = this.orderRepository
      .createQueryBuilder("order")
      .leftJoin("order.user", "user")
      .leftJoin("order.details", "orderDetail")
      .leftJoin("orderDetail.product", "product");

    if (filters.email) {
      query = query.andWhere("LOWER(user.email) LIKE LOWER(:email)", {
        email: `%${filters.email}%`,
      });
    }
    if (filters.id) {
      query = query.andWhere("order.id = :id", { id: filters.id });
    }
    if (filters.date) {
      query = query.andWhere("DATE(order.date) = :date", {
        date: filters.date,
      });
    }
    if (filters.productName) {
      query = query.andWhere("LOWER(product.name) LIKE LOWER(:productName)", {
        productName: `%${filters.productName}%`,
      });
    }
    if (filters.status) {
      query = query.andWhere("order.status = :status", {
        status: filters.status,
      });
    }

    const totalOrders = await query.getCount();
    return totalOrders;
  }

  async findById(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ["user", "details", "details.product"],
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
