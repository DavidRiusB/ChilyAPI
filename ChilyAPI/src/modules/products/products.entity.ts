import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}