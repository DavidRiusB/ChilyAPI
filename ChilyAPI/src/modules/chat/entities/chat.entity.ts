import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  deliveryId: number;

  @Column()
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}