import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { OrderDto, ProductsInOrder } from "./dto/order.dto";
import { DataSource } from "typeorm";
import { ProductsService } from "../products/products.service";
import { UserService } from "../user/user.service";
import { discountCalculator } from "src/common/middlewares/discountCalculator";
import { Order } from "./entity/order.entity";
import { OrderDetailsService } from "../order-details/order-details.service";
import { OrderDetail } from "../order-details/entity/order-details.entity";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { AddressesService } from "../addresses/addresses.service";
import { GoogleMapsService } from "../google-maps/google-maps.service";
import { TravelMode } from "@googlemaps/google-maps-services-js";
import { EstimatedTime } from "../google-maps/dto/estimatedTime.dto";
import { ResOrderDto } from "./dto/resOrder.dto";
import { OrderResponseDto } from "./dto/order-respose-admin.dto";
import { map } from "rxjs";
import { User } from "../user/entity/user.entity";
import { OrderStatus } from "src/common/enums";
import { Product } from "../products/products.entity";
import { NotificationEmailsService } from "../notifications/notificationEmails.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    private readonly addressService: AddressesService,
    private readonly orderDetailService: OrderDetailsService,
    private readonly googleMapsService: GoogleMapsService,
    private dataSource: DataSource,
    private readonly notificationEmailsService: NotificationEmailsService,
  ) {}

  async findAll(
    pagination: { page: number; limit: number },
    filters: {
      email?: string;
      id?: string;
      date?: string;
      productName?: string;
      price?: string;
      status?: OrderStatus;
    },
  ) {
    const orders = await this.orderRepository.findAll(pagination, filters);
    if (!orders || orders.length === 0) {
      console.error("No orders found");
      return [];
    }
    console.log("Orders fetched:", orders);
    return orders.map((order) => this.transformOrder(order));
  }

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
        console.log("AA");
        let products = await this.productService.findProductsByIds(productIds);
        console.log("Products fetched successfully:", products);

        if (productsInOrder.length !== products.length) {
          throw new BadRequestException("Uno o más productos no disponibles.");
        }

        // Stock control
        products.forEach((product) => {
          products = productsInOrder.map((element) => {
            if (product.stock < element.quantity)
              throw new BadRequestException("No hay sufuciente stock");
            product.stock = product.stock - element.quantity;
            return product;
          });
        });

        await this.orderRepository.updateStock(products);

        // Calculate shipping cost (hardcoded for now)
        const newOrder = new Order();
        newOrder.user = user;
        newOrder.address = addressUser; // Ensure addressUser is correctly set
        newOrder.total = total;
        newOrder.couponId = couponId;
        newOrder.couponDiscount = couponDiscount;
        newOrder.formBuy = formBuy;
        newOrder.orderInstructions = orderInstructions;
        newOrder.date = new Date();

        // Create Order
        const createdOrder = await manager.save(newOrder);
        console.log("Order created successfully:", createdOrder);
        await manager.save(newOrder);

        // Create OrderDetail entities in bulk
        const orderDetails = await this.orderDetailService.createOrderDetail(
          products,
          newOrder,
          productsInOrder,
        );
        console.log("Order details created successfully:", orderDetails);

        // Save order details and order
        await manager.save(OrderDetail, orderDetails);
        console.log("Order details saved successfully");

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
    resOrder.address = order.address; // Asumiendo que `order.address` ya es del tipo `Address`
    resOrder.details = order.details.map((detail) => ({
      productId: detail.product.id,
      name: detail.product.name,
      quantity: detail.quantity,
      price: detail.price,
    }));
    return resOrder;
  }

  // async updateStatus(update: UpdateOrderDto) {
  //   const { status, id } = update;
  //   try {
  //     const order = await this.findOrderById(id);
  //     const result = await this.orderRepository.updateStatus(order, status);
  //     if (result.affected !== 1) {
  //       throw new InternalServerErrorException(
  //         "Error interno del servidor al actualizar el estado de la Order",
  //       );
  //     }
  //     order.status = status;
  //     return order;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //   }
  // }

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

  // async getEstimatedTimeFromOrder(id: number) {
  //   const order = await this.findOrderById(id);
  //   const address = await this.addressService.getUserAddress(order.user.id);
  //   console.log(address);
  //   const convertAddressToGeometrySource =
  //     await this.googleMapsService.convertAddressToLatLng(process.env.ADDRESS);

  //   const convertToGeometryDestination =
  //     await this.googleMapsService.convertAddressToLatLng(
  //       `${address.city}, ${address.address}`,
  //     );

  //   let request: EstimatedTime = {
  //     origin: {
  //       lat: convertAddressToGeometrySource.lat,
  //       lng: convertAddressToGeometrySource.lng,
  //     },
  //     destination: {
  //       lat: convertToGeometryDestination.lat,
  //       lng: convertToGeometryDestination.lng,
  //     },
  //     mode: TravelMode.driving,
  //   };
  //   const estimatedTime =
  //     await this.googleMapsService.getEstimatedTime(request);

  //   return {
  //     order,
  //     estimatedTime,
  //   };
  // }
}
