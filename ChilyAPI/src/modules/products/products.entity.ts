import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category/category.entity";

@Entity({
    name: "products"
})

export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:"varchar",
        length:50,
        nullable:false
    })
    name: string;

    @Column({
        type:"varchar",
    })
    description: string;
    
    @Column({
        type:"decimal",
        precision:10,
        scale:2
    })
    price: number;
    
    @Column({
        type:"varchar"
    })
    image_url: string;

    @Column({
        type:"int",
        default:0,
        nullable:false
    })
    stock: number;

    @Column({
        type:"boolean",
    })
    avalible: boolean;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;
}