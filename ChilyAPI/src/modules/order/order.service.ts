import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";//
import { OrderRepository } from "./order.repository";
import { OrderDto } from "./dto/order.dto";
import { DataSource } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UserService } from "../user/user.service";
import { discountCalculator } from "src/common/middlewares/discountCalculator";
import { Order } from "./entity/order.entity";
import { OrderDetailsService } from "../order-details/order-details.service";
import { OrderDetail } from "../order-details/entity/order-details.entity";

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

  async addOrder(orderData: OrderDto, userId: number) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { branchId, productsInOrder, generalDiscount } = orderData;

        const discount = generalDiscount !== undefined ? generalDiscount : 0;

        // Fetch User
        const user = await this.userService.findUserById(userId);

        //Get ids from dto
        const productIds = productsInOrder.map((product) => product.productId);

        // Fetch products
        const products =
          await this.productService.findProductsByIds(productIds);
        console.log(products);

        if (productsInOrder.length !== products.length) {
          throw new BadRequestException("Uno o mas productos no disponibles.");
          // add util fucntion to show not avalible items
        }
        // Calculate total price
        const totalPrice = products.reduce(
          (sum, products) => sum + products.price,
          0
        );

        // calculate shipping cost
        //For now hardcoded
        const shipping = 10000;

        // Calculate final price after discount
        const finalPrice = discountCalculator(discount, totalPrice) + shipping;

        // check payment ?
        const order = {
          branchId,
          finalPrice,
          discount,
          user,
          shipping,
        };

        const newOrder = await this.orderRepository.create(order);
        await manager.save(Order, newOrder);

        // Save OrderDetail entities in bulk
        const orderDetails = await this.orderDetailService.createOrderDetail(
          products,
          newOrder,
          productsInOrder
        );
        await manager.save(OrderDetail, orderDetails);

        return { newOrder, orderDetails };
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }
}
