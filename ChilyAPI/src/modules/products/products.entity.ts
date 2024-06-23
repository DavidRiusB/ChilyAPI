import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "../category/category.entity";
import { OrderDetail } from "../order-details/order-details.entity";

@Entity({
  name: "products",
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: "text",
  })
  description: string;

  @Column({
    type: "int",
  })
  price: number;

  @Column({
    type: "text",
  })
  img: string;

  @Column({
    type: "boolean",
    default: true,
  })
  available: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetail: OrderDetail[];

  //@ManyToOne(() => Sucursal, (sucursal) => sucursal.products) //Agregar
  //sucursal:Sucursal;
}
