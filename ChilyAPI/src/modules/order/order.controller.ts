// Vendors
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

// Services
import { OrderService } from "./order.service";

// Guards
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

// Dtos
import { OrderDto } from "./dto/order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

// Documentation
import {
  DocumentationApiTagsModule,
  DocumentationGetAllOrders,
  DocumentationGetOrderById,
  DocumentationPostNewOrder,
  DocumentationUpdateOrderStatus,
} from "src/docs";

@Controller("orders")
@DocumentationApiTagsModule.clasification("Rutas para: Ordenes")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @DocumentationPostNewOrder()
  @UseGuards(JwtAuthGuard)
  async postNewOrder(@Body() orderData: OrderDto) {
    return await this.orderService.addOrder(orderData);
  }

  @Get("all-orders")
  @DocumentationGetAllOrders()
  async getAllOrders(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 5,
  ) {
    return await this.orderService.findAll({ page, limit });
  }

  @Get("order/:id")
  @DocumentationGetOrderById()
  async getOrderById(@Param("id") id: number) {
    return await this.orderService.findOrderById(id);
  }

  @Get("user/:id")
  async getOrdersByUser(@Param("id") id: number) {
    return await this.orderService.findOrdersByUser(id);
  }

  @Put("/update")
  @DocumentationUpdateOrderStatus()
  async updateOrderStatus(@Body() update: UpdateOrderDto) {
    return await this.orderService.updateStatus(update);
  }

  // @Get("branch/:id")
  // @DocumentationGetAllOrdersByBranchId()
  // /**
  //  * Retrieves all orders for a specific branch with pagination.
  //  * Accessible only by users with SuperAdmin and admin roles.
  //  *
  //  * @param {number} id - Branch ID.
  //  * @param {number} page - Page number for pagination (default is 1).
  //  * @param {number} limit - Number of items per page (default is 5).
  //  * @returns {Promise<Order[]>} - Array of orders.
  //  */
  // async getAllOrdersByBranchId(
  //   @Param("id") id: number,
  //   @Query("page") page: number = 1,
  //   @Query("limit") limit: number = 5,
  // ) {
  //   return await this.orderService.findAllOrderByBranchId(id, { page, limit });
  // }

  // @Get("/order/estimated")
  // @DocumentationObtainEstimatedTime()
  // async getEstimatedTime(@Query("id") id: number) {
  //   return await this.orderService.getEstimatedTimeFromOrder(id);
  // }
}
