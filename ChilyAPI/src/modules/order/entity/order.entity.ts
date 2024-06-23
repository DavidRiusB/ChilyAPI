import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,//
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";
import { OrderDetail } from "../../order-details/entity/order-details.entity";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "int" })
  total: number;

  @Column({ type: "int" })
  shipping: number;

  @Column({ name: "discount", default: 0 })
  generalDiscount?: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  details: OrderDetail[];
}
