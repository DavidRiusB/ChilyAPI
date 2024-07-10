import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "src/modules/user/entity/user.entity";
import { ChatLog } from "./chatLog.entity";

@Entity({ name: "chats" })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatLog, (chatLog) => chatLog.chats, {
    onDelete: "CASCADE",
  })
  chatLog: ChatLog;

  @Column({ type: "text" })
  text: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "SET NULL" })
  sender: User;

  @CreateDateColumn()
  createdAt: Date;
}
