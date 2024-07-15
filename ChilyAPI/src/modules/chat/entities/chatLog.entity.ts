import { Order } from "src/modules/order/entity/order.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./chat.entity";

@Entity({ name: "chat_log" })
export class ChatLog {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @OneToMany(() => Chat, (chat) => chat.chatLog)
  chats: Chat[];

  @Column()
  date: Date;

  @Column({ type: "text" })
  description: string;

  @Column({ default: true })
  pending: boolean;
}
