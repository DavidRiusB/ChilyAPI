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

  @Column({ type: "int" })
  shipping: number;

  // price = sum of details prices
  @Column({ type: "int", default: 0 })
  price: number;

  @Column({ name: "discount", default: 0 })
  generalDiscount?: number;

  @Column({ type: "int", default: 0 })
  total: number;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;
}
