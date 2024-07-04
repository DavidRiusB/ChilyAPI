import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('conversations')
export class Conversations {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdAt: Date;

    @ManyToMany(() => User)
    @JoinTable()
    participants: User[];
}