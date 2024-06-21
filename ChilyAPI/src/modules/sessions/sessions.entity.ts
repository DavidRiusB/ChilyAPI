import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true })
    accessToken: string;
    @Column({ nullable: true })//
    blacklisted: boolean
}