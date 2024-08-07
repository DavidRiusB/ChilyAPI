// Vendors
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards
} from "@nestjs/common";

// Services
import { OrderService } from "./order.service";

// Guards
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

// Dtos
import { OrderDto } from "./dto/order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Response } from "express";
// Documentation
import {
  DocumentationApiTagsModule,
  DocumentationGeneratePdf,
  DocumentationGetAllOrders,
  DocumentationGetOrderById,
  DocumentationGetOrdersByUser,
  DocumentationPostNewOrder,
  DocumentationUpdateOrderStatus
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
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5",
    @Query("email") email?: string,
    @Query("id") id?: string,
    @Query("date") date?: string,
    @Query("productName") productName?: string,
    @Query("status") status?: OrderStatus
  ) {
    const filters = {
      email,
      id,
      date,
      productName: productName ? `%${productName}%` : undefined,
      status
    };
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.orderService.findAll(
      { page: pageNumber, limit: limitNumber },
      filters
    );
  }

  @Get("order/:id")
  @DocumentationGetOrderById()
  async getOrderById(@Param("id") id: number) {
    return await this.orderService.findOrderById(id);
  }

  @Get("user/:id")
  @DocumentationGetOrdersByUser()
  async getOrdersByUser(@Param("id") id: number) {
    return await this.orderService.findOrdersByUser(id);
  }

  @Put("/update")
  @DocumentationUpdateOrderStatus()
  async updateOrderStatus(@Body() update: UpdateOrderDto) {
    return await this.orderService.updateStatus(update);
  }

  @Get("/generate-pdf/:id")
  @DocumentationGeneratePdf()
  async generatePdf(@Param("id") id: number, @Res() res: Response) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="order-${id}.pdf"`);
    return await this.orderService.generatePdf(id, res);
  }

  // @Get("/order/estimated")
  // @DocumentationObtainEstimatedTime()
  // async getEstimatedTime(@Query("id") id: number) {
  //   return await this.orderService.getEstimatedTimeFromOrder(id);
  // }
}
