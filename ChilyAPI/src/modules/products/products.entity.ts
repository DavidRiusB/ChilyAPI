import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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
        type:"varchar",
        default:"https://static.wixstatic.com/media/2cb99a_bd3c575ae419467a8c640a8732ddb2f9~mv2.png/v1/fit/w_180,h_180,q_90/2cb99a_bd3c575ae419467a8c640a8732ddb2f9~mv2.png"
    })
    image_url: string;

    @Column({
        type:"boolean",
    })
    avalible: boolean;

    @ManyToMany(() => Category, (category) => category.products)
    category: Category[];

}