import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "../category/category.entity";
import { OrderDetail } from "../order-details/entity/order-details.entity";

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
    type: "float",
  })
  price: number;

  @Column({ nullable: true, unique: true })
  imgName: string;

  @Column({
    type: "text",
    default:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  })
  img: string;

  @Column({
    type: "boolean",
    // default: false, // Activar cuando este listo el desarrollo de front
  })
  isPopular: boolean;

  @Column({
    type: "int",
    default: 0,
  })
  stock: number;

  @Column({
    type: "boolean",
    default: false,
  })
  isDeleted: boolean;

  @ManyToMany(() => Category, (category) => category.products)
  category: Category[];

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetail: OrderDetail[];

  //@ManyToOne(() => Sucursal, (sucursal) => sucursal.products) //Agregar
  //sucursal:Sucursal;
}
