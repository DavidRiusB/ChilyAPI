import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/entity/user.entity";

@Entity({
    name: "dicounts"    
})
export class Discount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        length: 15,
        nullable: false,
        type: "varchar"
    })
    code: string;

    @Column({
        type: "int",
        default: 0,
        nullable: false
    })
    discount: number;

    @Column({
        type: "boolean",
        default: true
    })
    isValid: boolean;

    @ManyToOne(()=> User, (user)=> user.discounts)
    user: User;

    @Column({
        type: "boolean",
        default: false
    })
    isDeleted: boolean;
}