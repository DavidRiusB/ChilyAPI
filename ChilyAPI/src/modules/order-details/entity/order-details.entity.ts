import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";//
import { Order } from "../../order/entity/order.entity";
import { Product } from "../../products/products.entity";
import { OrderDetailStatus } from "src/common/enums";

@Entity({ name: "order_details" })
export class OrderDetail {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @ManyToOne(() => Order, (order) => order.details, {
    onDelete: "CASCADE",
    cascade: ["soft-remove"],
  })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetail)
  product: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: "int" })
  price: number;

  @Column({ nullable: true, default: 0 })
  discount: number;

  @Column({
    type: "enum",
    enum: OrderDetailStatus,
    default: OrderDetailStatus.Pending,
  })
  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;
}
