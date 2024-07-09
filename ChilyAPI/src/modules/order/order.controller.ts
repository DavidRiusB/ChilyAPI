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
import { OrderStatus } from "src/common/enums";

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
    @Query("email") email?: string,
    @Query("id") id?: string,
    @Query("date") date?: string,
    @Query("productName") productName?: string,
    @Query("status") status?: OrderStatus,
  ) {
    const filters = { email, id, date, productName, status };
    return await this.orderService.findAll({ page, limit }, filters);
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


  // @Get("/order/estimated")
  // @DocumentationObtainEstimatedTime()
  // async getEstimatedTime(@Query("id") id: number) {
  //   return await this.orderService.getEstimatedTimeFromOrder(id);
  // }
}
