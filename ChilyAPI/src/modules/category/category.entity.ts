import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/products.entity";

@Entity({
  name: "categories",//
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
    length: 50,
  })
  name: string;

  @Column({ type: "text", default: "Extremadamente Sabroso " })
  description: string;

  @ManyToMany(() => Product, (product) => product.category)
  products: Product[];
}
