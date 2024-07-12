import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Conversations } from "./conversation.entity";
import { User } from "src/modules/user/entity/user.entity";

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Conversations, conversation => conversation.id, { onDelete: 'CASCADE'})
  conversation: Conversations;

  @ManyToOne(()=> User, user => user.id, { onDelete: 'SET NULL' })
  sender: User;
}