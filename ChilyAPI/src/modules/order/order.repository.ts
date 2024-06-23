import { Injectable } from "@nestjs/common";
import { OrderDto } from "./dto/order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./entity/order.entity";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}
  // Mock data (replace with actual database or service calls)
  private orders = [
    { id: 1, branchId: 1 /* other properties */ },
    { id: 2, branchId: 2 /* other properties */ },
    // Add more mock orders as needed
  ];

  // Mock ID (used for creating new orders)
  private mockId: number = 3;

  /**
   * Retrieves all orders with pagination.
   *
   * @param {Object} pagination - Pagination details.
   * @param {number} pagination.page - Page number.
   * @param {number} pagination.limit - Number of items per page.
   * @returns {Promise<Order[]>} - A promise that resolves to an array of orders.
   */
  async findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    return await this.orders.slice(offset, offset + limit);
  }

  /**
   * Retrieves all orders for a specific branch with pagination.
   *
   * @param {number} id - Branch ID.
   * @param {Object} pagination - Pagination details.
   * @param {number} pagination.page - Page number.
   * @param {number} pagination.limit - Number of items per page.
   * @returns {Promise<Order[]>} - A promise that resolves to an array of orders for the branch.
   */
  async findAllOrderByBranchId(
    id: number,
    pagination: { page: number; limit: number }
  ) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Placeholder logic: Filter orders by branch ID (assuming id matches branchId in mock data)
    const branchOrders = this.orders.filter((order) => order.branchId === id);

    return await branchOrders.slice(offset, offset + limit);
  }

  /**
   * Retrieves an order by its ID.
   *
   * @param {number} id - The ID of the order to retrieve.
   * @returns {Promise<Object|null>} - The order if found, or null if not found.
   */
  async findById(id: number): Promise<Object | null> {
    const order = this.orders.find((order) => order.id === id);
    return await Promise.resolve(order || null);
  }

  /**
   * Creates a new order.
   *
   * @param {OrderDto} order - The order to create.
   * @returns {Promise<Object>} - The created order.
   */
  async create(order) {
    const { branchId, finalPrice, discount, user, shipping } = order;

    const newOrder = new Order();
    newOrder.total = finalPrice;
    newOrder.generalDiscount = discount;
    newOrder.shipping = shipping;
    newOrder.user = user;
    newOrder.date = new Date();
    return await this.orderRepository.create(newOrder);
  }
}
