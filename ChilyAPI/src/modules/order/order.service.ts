import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { OrderDto } from "./dto/order.dto";
import { DataSource } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UserService } from "../user/user.service";
import { discountCalculator } from "src/common/middlewares/discountCalculator";
import { Order } from "./entity/order.entity";
import { OrderDetailsService } from "../order-details/order-details.service";
import { OrderDetail } from "../order-details/entity/order-details.entity";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    private readonly orderDetailService: OrderDetailsService,
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
  async findOrderById(id: number): Promise<Order> {
    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        throw new NotFoundException(
          `No se encontraron registros con el numero de Orden: ${id}`
        );
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al buscar Orden"
      );
    }
  }

  async addOrder(orderData: OrderDto, userId: number) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { branchId, productsInOrder, generalDiscount } = orderData;
        const discount = generalDiscount !== undefined ? generalDiscount : 0;

        // Fetch User
        const user = await this.userService.findUserById(userId);
        console.log("User fetched successfully:", user);

        // Get ids from dto
        const productIds = productsInOrder.map((product) => product.productId);

        // Fetch products
        const products =
          await this.productService.findProductsByIds(productIds);
        console.log("Products fetched successfully:", products);

        if (productsInOrder.length !== products.length) {
          throw new BadRequestException("Uno o más productos no disponibles.");
        }

        // Calculate shipping cost (hardcoded for now)
        const shipping = 10000;

        const order = {
          branchId,
          discount,
          user,
          shipping,
        };

        // Create Order
        const newOrder = await this.orderRepository.create(order);
        console.log("Order created successfully:", newOrder);

        await manager.save(newOrder);

        // Create OrderDetail entities in bulk
        const orderDetails = await this.orderDetailService.createOrderDetail(
          products,
          newOrder,
          productsInOrder
        );
        console.log("Order details created successfully:", orderDetails);

        // Calculate total price of order details
        const totalPrice = orderDetails.reduce(
          (sum, detail) => sum + detail.total,
          0
        );

        // Calculate final price with general discount and shipping
        const finalPrice = discountCalculator(discount, totalPrice) + shipping;
        console.log("Total price:", totalPrice);
        console.log("Final price:", finalPrice);

        // Update the order with calculated prices
        newOrder.price = totalPrice;
        newOrder.total = finalPrice;

        console.log("New order before save:", newOrder);

        // Save order details and order
        await manager.save(OrderDetail, orderDetails);
        console.log("Order details saved successfully");
        await manager.save(Order, newOrder);
        console.log("Order saved successfully");

        return { newOrder, orderDetails };
      });
    } catch (error) {
      console.error("Error in transaction:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  async updateStatus(id: number, update: UpdateOrderDto) {
    const { status } = update;
    try {
      const order = await this.findOrderById(id);
      const result = await this.orderRepository.updateStatus(order, status);
      if (result.affected !== 1) {
        throw new InternalServerErrorException(
          "Error interno del servidor al actualizar el estado de la Order"
        );
      }
      order.status = status;
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }
}
