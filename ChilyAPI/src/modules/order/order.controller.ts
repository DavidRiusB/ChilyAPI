import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dto/order.dto";
import { DocumentationApiTagsModule } from "src/docs";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Controller("orders")
@DocumentationApiTagsModule.clasification("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  /**
   * Retrieves all orders with pagination.
   * Accessible only by users with SuperAdmin role.
   *
   * @param {number} page - Page number for pagination (default is 1).
   * @param {number} limit - Number of items per page (default is 5).
   * @returns {Promise<{ data: Order[], total: number, page: number, limit: number }>}
   */
  async getAllOrders(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 5
  ) {
    return await this.orderService.findAll({ page, limit });
  }

  @Get("branch/:id")
  /**
   * Retrieves all orders for a specific branch with pagination.
   * Accessible only by users with SuperAdmin and admin roles.
   *
   * @param {number} id - Branch ID.
   * @param {number} page - Page number for pagination (default is 1).
   * @param {number} limit - Number of items per page (default is 5).
   * @returns {Promise<Order[]>} - Array of orders.
   */
  async getAllOrdersByBranchId(
    @Param("id") id: number,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 5
  ) {
    return await this.orderService.findAllOrderByBranchId(id, { page, limit });
  }

  @Get(":id")
  /**
 * Retrieves a order by Id.
 * Accessible only by users with SuperAdmin, admin, delivery and user roles.
*
 * @param {number} id - Branch ID.
 
 * @returns {Promise<Order>} - A order.
 */
  async getOrderById(@Param("id") id: number) {
    return await this.orderService.findOrderById(id);
  }

  @Post(":id")
  /**
   * Post a new Order
   * @body new order DTO
   * @return {Promise<Order>}
   */
  async postNewOrder(@Param("id") id: number, @Body() orderData: OrderDto) {
    return await this.orderService.addOrder(orderData, id);
  }

  @Put(":id")
  async updateOrderStatus(
    @Param("id") id: number,
    @Body() update: UpdateOrderDto
  ) {
    return await this.orderService.updateStatus(id, update);
  }
}
