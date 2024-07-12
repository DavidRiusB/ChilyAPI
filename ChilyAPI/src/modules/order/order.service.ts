// Vendors
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { DataSource } from "typeorm";

// Services
import { ProductsService } from "../products/products.service";
import { UserService } from "../user/user.service";
import { AddressesService } from "../addresses/addresses.service";
import { NotificationEmailsService } from "../notifications/notificationEmails.service";

// Reposities
import { OrderRepository } from "./order.repository";
import { ProductsRepository } from "../products/products.repository";

// Dtos
import { OrderDto, ProductsInOrder } from "./dto/order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ResOrderDto } from "./dto/resOrder.dto";
import { OrderResponseDto } from "./dto/order-respose-admin.dto";

// Entities
import { Order } from "./entity/order.entity";
import { OrderDetail } from "../order-details/entity/order-details.entity";

// Enum
import { OrderStatus } from "src/common/enums";

import { Response } from "express";
import { PdfService } from "src/common/helpers/pdf/pdf.service";
import { PdfDataDto } from "src/common/helpers/pdf/pdf.dto";
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductsService,
    private readonly productRepository: ProductsRepository,
    private readonly userService: UserService,
    private readonly addressService: AddressesService,
    private dataSource: DataSource,
    private readonly notificationEmailsService: NotificationEmailsService,
    private readonly pdfService: PdfService,
  ) {}

  async addOrder(orderData: OrderDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const {
          userId,
          productsInOrder,
          address,
          total,
          couponId,
          couponDiscount,
          formBuy,
          orderInstructions,
        } = orderData;

        // Fetch User
        const user = await this.userService.findUserById(userId);
        const addressUser = await this.addressService.getUserAddress(address);
        console.log("User fetched successfully:", user);
        console.log("Address fetched successfully:", addressUser);

        // Get ids from dto
        const productIds = productsInOrder.map((product) => product.productId);

        // Fetch products
        let products = await this.productService.findProductsByIds(productIds);
        console.log("Products fetched successfully:", products);

        if (productsInOrder.length !== products.length) {
          throw new BadRequestException("Uno o más productos no disponibles.");
        }

        // Stock control
        products = products.map((product) => {
          const productInOrder = productsInOrder.find(
            (p) => p.productId === product.id,
          );
          if (product.stock < productInOrder.quantity) {
            throw new BadRequestException("No hay suficiente stock");
          }
          product.stock -= productInOrder.quantity;
          return product;
        });

        await this.productRepository.updateStock(products);

        // Calculate shipping cost
        const newOrder = new Order();
        newOrder.user = user;
        newOrder.address = addressUser;
        newOrder.total = total;
        newOrder.couponId = couponId;
        newOrder.couponDiscount = couponDiscount;
        newOrder.formBuy = formBuy;
        newOrder.orderInstructions = orderInstructions;
        newOrder.date = new Date();

        // Create Order
        const createdOrder = await manager.save(newOrder);
        console.log("Order created successfully:", createdOrder);

        // Create OrderDetail entities in bulk
        const orderDetails = productsInOrder.map((productInOrder) => {
          const product = products.find(
            (p) => p.id === productInOrder.productId,
          );
          const orderDetail = new OrderDetail();
          orderDetail.product = product;
          orderDetail.order = createdOrder;
          orderDetail.quantity = productInOrder.quantity;
          orderDetail.price = productInOrder.price;
          orderDetail.total = productInOrder.price * productInOrder.quantity;
          return orderDetail;
        });

        console.log("Order details created successfully:", orderDetails);

        // Save order details and order
        await manager.save(OrderDetail, orderDetails);
        console.log("Order details saved successfully");

        await this.notificationEmailsService.sendOrderConfirmationEmail(
          user.email,
          user.name,
          createdOrder.id.toString(),
          orderDetails,
          total,
        );

        return { newOrder: createdOrder, orderDetails };
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException("Unexpected error occurred");
    }
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
    const orders = await this.orderRepository.findAll(pagination, filters);

    if (!orders || orders.length === 0) {
      console.error("No orders found");
      return { orders: [], total: 0 };
    }

    // Count total orders matching filters
    const total = await this.orderRepository.countOrders(filters);

    const ordersQuantity = {
      orders: orders.map((order) => this.transformOrder(order)),
      total:total,
    };

    return ordersQuantity;
  }

  private transformOrder(order: any): OrderResponseDto {
    const orderResponseDto = new OrderResponseDto();

    orderResponseDto.id = order.id.toString();
    orderResponseDto.price = `$${order.total.toFixed(2)}`;
    orderResponseDto.date = order.date.toISOString();
    orderResponseDto.status = this.mapStatus(order.status);
    orderResponseDto.products = order.details.map((detail: any) => ({
      name: detail.product.name,
      quantity: detail.quantity,
      price: `$${detail.product.price.toFixed(2)}`,
    }));
    if (order.user) {
      orderResponseDto.email = order.user.email;
    } else {
      orderResponseDto.email = "Usuario no asignado";
    }
    return orderResponseDto;
  }

  private mapStatus(status: string) {
    const statusMap = {
      Pending: "Pendiente",
      InPreparation: "En preparación",
      Shipped: "En camino",
      Delivered: "Entregada",
    };
    return statusMap[status] || status;
  }

  async findOrderById(id: number): Promise<Order> {
    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        throw new NotFoundException(
          `No se encontró una orden con el ID: ${id}`,
        );
      }
      return order;
    } catch (error) {
      throw new NotFoundException(`No se encontró una orden con el ID: ${id}`);
    }
  }

  async findOrdersByUser(userId: number): Promise<ResOrderDto[]> {
    try {
      const orders = await this.orderRepository.findOrdersByUser(userId);
      return orders.map((order) => this.mapOrderToResOrderDto(order));
    } catch (error) {
      throw new NotFoundException(
        `No se encontraron órdenes para el usuario con ID: ${userId}`,
      );
    }
  }

  private mapOrderToResOrderDto(order: Order): ResOrderDto {
    const resOrder = new ResOrderDto();
    resOrder.id = order.id;
    resOrder.date = order.date;
    resOrder.status = order.status;
    resOrder.total = order.total;
    resOrder.formBuy = order.formBuy;
    resOrder.address = order.address;
    resOrder.details = order.details.map((detail) => ({
      productId: detail.product.id,
      name: detail.product.name,
      quantity: detail.quantity,
      price: detail.price,
    }));
    return resOrder;
  }

  async updateStatus(update: UpdateOrderDto): Promise<Order> {
    const { status, id } = update;
    try {
      const order = await this.findOrderById(id);
      const result = await this.orderRepository.updateStatus(order, status);
      if (result.affected !== 1) {
        throw new InternalServerErrorException(
          "Error interno del servidor al actualizar el estado de la Order",
        );
      }
      order.status = status;

      await this.notificationEmailsService.sendStatusUpdateEmail(
        order.user.email,
        order.user.name,
        order.id,
        order.status,
      );

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al actualizar el estado de la Order",
      );
    }
  }
  async generatePdf(id: number, res: Response) {
    const order = await this.findOrderById(id);
    console.log(order);
    const data: PdfDataDto = {
      order: order.details.map((detail) => ({
        name: detail.product.name,
        quantity: detail.quantity,
        price: detail.price,
      })),
      totalPrice: order.total,
      email: order.user.email,
      username: order.user.name,
    };
    const pdf = await this.pdfService.generatePdf(data, res);
    return pdf;
  }
}
