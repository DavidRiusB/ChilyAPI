import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @Column({
    type: "boolean",
    default: false,
  })
  isDeleted: boolean;

  @ManyToMany(() => Product, (product) => product.category)
  @JoinTable({
    name: "category_products",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id"
    }
  })
  products: Product[];
}
