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
  ) {}


  async findAll(pagination: { page: number; limit: number }): Promise<Object> {
    const orders = await this.orderRepository.findAll(pagination);
    if (!orders || orders.length === 0) {
      console.error("No orders found");
      return [];
    }
    console.log("Orders fetched:", orders);
    return orders.map((order) => this.transformOrder(order));
  }

  private transformOrder(order: any): OrderResponseDto {
    return {
      id: order.id.toString(),
      price: `$${order.total.toFixed(2)}`,
      date: order.date.toISOString(),
      status: this.mapStatus(order.status),
      products: order.details.map((detail: any) => ({
        name: detail.product.name,
        quantity: detail.quantity,
        price: `$${detail.product.price.toFixed(2)}`,
      })),
    };
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

  /**
   * Retrieves all orders for a specific branch with pagination.
   *
   * @param {number} id - Branch ID.
   * @param {Object} pagination - Pagination options including page number and limit.
   * @returns {Promise<Object>} - Paginated list of orders for the branch.
   */
  async findAllOrderByBranchId(
    id: number,
    pagination: { page: number; limit: number },
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
          `No se encontraron registros con el número de Orden: ${id}`,
        );
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al buscar Orden de este usuario",
      );
    }
  }

  async findOrdersByUser(id: number): Promise<ResOrderDto[]> {
    try {
      const resOrderArray: ResOrderDto[] = [];
      const orderUser = await this.orderRepository.findOrdersByUser(id);
      if (!orderUser || orderUser.length === 0) {
        throw new ForbiddenException('No se encontraron ordenes de este usuario');
      }
     orderUser.forEach((order)=>{
        const resOrder = new ResOrderDto();
        resOrder.address = order.address,
        resOrder.date = order.date,
        resOrder.details = order.details.map((detail)=>{
          const aux = new ProductsInOrder();
          aux.name = detail.product.name;
          aux.quantity = detail.quantity;
          aux.price = detail.price
          return aux;
        })
        resOrder.formBuy = order.formBuy,
        resOrder.id = order.id,
        resOrder.status = order.status,
        resOrder.total = order.total,
        resOrderArray.push(resOrder)
      })

      return resOrderArray;

    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
        const products =
          await this.productService.findProductsByIds(productIds);
        console.log("Products fetched successfully:", products);

        if (productsInOrder.length !== products.length) {
          throw new BadRequestException("Uno o más productos no disponibles.");
        }

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
      console.error("Error in transaction:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Unexpected error occurred");
    }
  }

  async findAll(pagination: {
    page: number;
    limit: number;
  }): Promise<OrderResponseDto[]> {
    try {
      const orders: Order[] = await this.orderRepository.findAll(pagination);

      if (!orders || orders.length === 0) {
        console.error("No orders found");
        return [];
      }

      const orderResponseDtos: OrderResponseDto[] = orders.map((order) =>
        this.transformOrder(order),
      );

      return orderResponseDtos;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
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

  // async findOrderById(id: number): Promise<Order> {
  //   try {
  //     const order = await this.orderRepository.findById(id);
  //     if (!order) {
  //       throw new NotFoundException(
  //         `No se encontraron registros con el número de Orden: ${id}`,
  //       );
  //     }
  //     return order;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(
  //       "Error interno del servidor al buscar Orden de este usuario",
  //     );
  //   }
  // }
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

  // async findOrdersByUser(id: number): Promise<ResOrderDto[]> {
  //   try {
  //     const resOrderArray: ResOrderDto[] = [];
  //     const orderUser = await this.orderRepository.findOrdersByUser(id);
  //     if (!orderUser || orderUser.length === 0) {
  //     }
  //     orderUser.forEach((order) => {
  //       const resOrder = new ResOrderDto();
  //       (resOrder.address = order.address),
  //         (resOrder.date = order.date),
  //         (resOrder.details = order.details.map((detail) => {
  //           const aux = new ProductsInOrder();
  //           aux.name = detail.product.name;
  //           aux.quantity = detail.quantity;
  //           aux.price = detail.price;
  //           return aux;
  //         }));
  //       (resOrder.formBuy = order.formBuy),
  //         (resOrder.id = order.id),
  //         (resOrder.status = order.status),
  //         (resOrder.total = order.total),
  //         resOrderArray.push(resOrder);
  //     });

  //     return resOrderArray;
  //   } catch (error) {}
  // }

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

  async updateStatus(update: UpdateOrderDto) {
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
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  // async findAllOrderByBranchId(
  //   id: number,
  //   pagination: { page: number; limit: number },
  // ): Promise<Object> {
  //   // Placeholder logic for fetching orders by branch ID
  //   id = 1; // Replace with actual logic to fetch orders by branch ID

  //   return await this.orderRepository.findAllOrderByBranchId(id, pagination);
  // }

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
