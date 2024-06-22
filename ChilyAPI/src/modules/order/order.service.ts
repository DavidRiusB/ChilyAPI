import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { OrderDto } from "./order.dto";
import { DataSource } from "typeorm";
import { ProductsService } from "../products/products.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductsService,
    private dataSource: DataSource
  ) {}

  /**
   * Retrieves all orders with pagination.
   *
   * @param {Object} pagination - Pagination options including page number and limit.
   * @returns {Promise<Object>} - Paginated list of orders.
   */
  async findAll(pagination: { page: number; limit: number }): Promise<Object> {
    return await this.orderRepository.findAll(pagination);
  }

  /**
   * Retrieves all orders for a specific branch with pagination.
   *
   * @param {number} id - Branch ID.
   * @param {Object} pagination - Pagination options including page number and limit.
   * @returns {Promise<Object>} - Paginated list of orders for the branch.
   */
  async findAllOrderByBranchId(
    id: number,
    pagination: { page: number; limit: number }
  ): Promise<Object> {
    // Placeholder logic for fetching orders by branch ID
    id = 1; // Replace with actual logic to fetch orders by branch ID

    return await this.orderRepository.findAllOrderByBranchId(id, pagination);
  }

  /**
   * Retrieves an order by its ID.
   *
   * @param {number} id - Order ID.
   * @returns {Promise<Order>} - A promise that resolves to the order if found.
   * @throws {NotFoundException} - If the order with the given ID is not found.
   * @throws {InternalServerErrorException} - If any other error occurs during the process.
   */
  async findOrderById(id: number) {
    try {
      // Placeholder logic for fetching order by ID
      id = 1; // Replace with actual logic to fetch the correct order ID
      const order = await this.orderRepository.findById(id);

      if (!order) {
        throw new NotFoundException(`No se encontró orden con ID: ${id}`);
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al buscar orden ${id}, por favor inténtelo de nuevo`,
        error
      );
    }
  }

  /**
   * Add a new order
   *
   * @param {OrderDto} order - Order .
   * @returns {Promise<Order>} - A promise that resolves to the order if found.
   * @throws {NotFoundException} - If the order with the given ID is not found.
   * @throws {InternalServerErrorException} - If any other error occurs during the process.
   */
  async addOrder(orderData: OrderDto) {
    try {
      const { branchId, productsIds } = orderData;
      return await this.dataSource.transaction(async (manager) => {
        // check products abilibility
        const products = productsIds;

        // calculate shipping cost
        //check user id
        // calculate discounts
        //chect total price
        // aply discount
        // add delivery id
        // check payment ?
        //
        const orderData = { branchId };
        const newOrder = await this.orderRepository.create(orderData);
        /* await manager.save(Order, newOrder) */
        return await newOrder;
      });
    } catch (error) {}
  }
}
