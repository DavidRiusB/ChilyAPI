import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "../../order/entity/order.entity";
import { Product } from "../../products/products.entity";
import { OrderDetailStatus } from "src/common/enums";
import { Discount } from "src/modules/discount/discount.entity";

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

  @Column()
  price: number;

  @Column({ nullable: true, default: 0 })
  discount: number;

  @Column()
  total: number;

  @Column({
    type: "enum",
    enum: OrderDetailStatus,
    default: OrderDetailStatus.Pending,
  })
  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @OneToOne(() => Discount)
  discountCode: Discount;
}
