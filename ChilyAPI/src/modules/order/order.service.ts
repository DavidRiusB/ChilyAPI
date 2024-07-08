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
import { AddressesService } from "../addresses/addresses.service";
import { GoogleMapsService } from "../google-maps/google-maps.service";
import { TravelMode } from "@googlemaps/google-maps-services-js";
import { EstimatedTime } from "../google-maps/dto/estimatedTime.dto";

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
          `No se encontraron registros con el numero de Orden: ${id}`,
        );
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al buscar Orden",
      );
    }
  }

  async findOrdersByUser(id: number) {
    try {
      const orderUser = await this.orderRepository.findOrdersByUser(id);
      if (!orderUser || orderUser.length === 0) {
        console.log("Este usuario no tiene orderes aún");
        // throw new NotFoundException(
        //   `No se encontraron órdenes para el usuario: ${id}`,
        // );
      }
      return orderUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al buscar órdenes",
      );
    }
  }

  async addOrder(orderData: OrderDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const {
          userId,
          productsInOrder,
          addressId,
          total,
          couponId,
          coupoundDiscount,
          formBuy,
          // generalDiscount,
          // shipping,
          // finalPrice,
        } = orderData;
        // const discount = generalDiscount !== undefined ? generalDiscount : 0;

        // Fetch User
        const user = await this.userService.findUserById(userId);
        const address = await this.addressService.getUserAddress(addressId);
        console.log("User fetched successfully:", user);
        console.log("Address fetched successfully:", address);

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

        const order = {
          // discount,
          user,
          // shipping,
          address,
          total,
          // finalPrice,
          couponId,
          coupoundDiscount,
          formBuy,
        };

        // Create Order
        const newOrder = await this.orderRepository.create(order);
        console.log("Order created successfully:", newOrder);

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
