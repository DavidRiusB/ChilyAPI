import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dto/order.dto";
import {
  DocumentationApiTagsModule,
  DocumentationGetAllOrders,
  DocumentationGetAllOrdersByBranchId,
  DocumentationGetOrderById,
  DocumentationObtainEstimatedTime,
  DocumentationPostNewOrder,
  DocumentationUpdateOrderStatus,
} from "src/docs";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { RemovePropertiesInterceptor } from "src/common/interceptors";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@Controller("orders")
@DocumentationApiTagsModule.clasification("Rutas para: Ordenes")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @DocumentationGetAllOrders()
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
    @Query("limit") limit: number = 5,
  ) {
    return await this.orderService.findAll({ page, limit });
  }

  @Get("branch/:id")
  @DocumentationGetAllOrdersByBranchId()
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
    @Query("limit") limit: number = 5,
  ) {
    return await this.orderService.findAllOrderByBranchId(id, { page, limit });
  }

  @Get(":id")
  @DocumentationGetOrderById()
  async getOrderById(@Param("id") id: number) {
    return await this.orderService.findOrderById(id);
  }

  @Get("user/:id")
  async getOrdersByUser(@Param("id") id: number) {
    return await this.orderService.findOrdersByUser(id);
  }

  @Post()
  @DocumentationPostNewOrder()
  @UseGuards(JwtAuthGuard)
  async postNewOrder(@Body() orderData: OrderDto) {
    return await this.orderService.addOrder(orderData);
  }

  @Put("/update")
  @DocumentationUpdateOrderStatus()
  async updateOrderStatus(@Body() update: UpdateOrderDto) {
    return await this.orderService.updateStatus(update);
  }

  // @Get("/order/estimated")
  // @DocumentationObtainEstimatedTime()
  // async getEstimatedTime(@Query("id") id: number) {
  //   return await this.orderService.getEstimatedTimeFromOrder(id);
  // }
}
