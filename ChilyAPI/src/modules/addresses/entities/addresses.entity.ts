import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "addresses"
})
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    city: string;

    @Column()
    address: string;

    @Column()
    postalCode: string;

    @ManyToOne(() => User, (user) => user.addresses)
    user: User
}