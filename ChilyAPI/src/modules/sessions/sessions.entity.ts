import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    expiresAt: Date;
    @Column({ nullable: true })
    accessToken: string;
    @Column({ nullable: true, type: "boolean", default: false })//
    blacklisted: boolean;
}