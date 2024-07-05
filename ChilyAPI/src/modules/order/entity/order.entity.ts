import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";
import { OrderDetail } from "../../order-details/entity/order-details.entity";
import { OrderStatus } from "src/common/enums";
import { Address } from "src/modules/addresses/entities/addresses.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  @JoinColumn({ name: "order_details" })
  details: OrderDetail[];

  // @Column({ type: "int" })
  // shipping: number;

  // price = sum of details prices
  @Column({ type: "int", default: 0 })
  price: number;

  // @Column({ name: "discount", default: 0 })
  // generalDiscount?: number;
  @Column({ nullable: true }) // Allow null values for couponId
  couponId?: string | null;

  @Column({ nullable: true }) // Allow null values for coupoundDiscount
  coupoundDiscount?: number;

  @Column()
  formBuy: "efectivo" | "tarjeta";

  @Column({ type: "int", default: 0 })
  total: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "address_id" }) // Nombre de la columna en la tabla orders
  address: Address;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;
}
