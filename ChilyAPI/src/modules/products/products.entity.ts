import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category/category.entity";

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
  image_url: string;

  @Column({
    type: "boolean",
    default: true,
  })
  available: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  //@ManyToOne(() => Sucursal, (sucursal) => sucursal.products) //Agregar
  //sucursal:Sucursal;
}
