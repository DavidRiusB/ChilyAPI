import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/products.entity";

@Entity({
  name: "categories",
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

  @Column({
    type: "varchar",
  })
  icon: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
