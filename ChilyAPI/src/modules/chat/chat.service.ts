import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { CreateMessageDto } from "./dto/message.dto";
import { Chat } from "./entities/chat.entity";
import { ChatLog } from "./entities/chatLog.entity";
import { OrderService } from "../order/order.service";
import { error } from "console";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatLog)
    private chatLogRepository: Repository<ChatLog>,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) {}

  async createChatLog(chatData: CreateMessageDto): Promise<ChatLog> {
    try {
      const { orderId, description } = chatData;
      const order = await this.orderService.findOrderById(orderId);

      const newChatLog = new ChatLog();
      newChatLog.order = order;
      newChatLog.description = description;
      newChatLog.date = new Date();

      await this.chatLogRepository.save(newChatLog);
      return newChatLog;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async findChatLogById(chatLogId: number): Promise<ChatLog> {
    const chatLog = await this.chatLogRepository.findOne({
      where: { id: chatLogId },
      relations: ["order"],
    });
    if (!chatLog) {
      throw new NotFoundException(`Chat Log Not Found with id: ${chatLogId}`);
    }
    return chatLog;
  }

  async createChat(
    text: string,
    userId: number,
    chatLogId: number
  ): Promise<Chat> {
    try {
      const user = await this.userService.findUserById(userId);
      const chatLog = await this.findChatLogById(chatLogId);
      console.log(user);
      console.log(chatLog);

      const newChat = new Chat();
      newChat.chatLog = chatLog;
      newChat.sender = user;
      newChat.text = text;
      newChat.createdAt = new Date();

      await this.chatRepository.save(newChat);
      console.log(newChat);
      return newChat;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to create chat");
    }
  }

  async getChatLogByOrderId(orderId) {
    const chatLog = await this.chatLogRepository.findOne({
      where: { order: { id: orderId } },
    });
    if (!chatLog) {
      throw new NotFoundException(
        "`Chat Log Not Found with order id: ${orderId}`"
      );
    }
    return chatLog;
  }

  async getMessages(chatLogId: number): Promise<Chat[]> {
    const messages = await this.chatRepository
      .createQueryBuilder("chat")
      .where("chat.chatLogId = :chatLogId", { chatLogId })
      .getMany();
    return messages;
  }

  async findAllLogs(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const [logs, total] = await this.chatLogRepository
      .createQueryBuilder("logs")
      .leftJoinAndSelect("logs.chats", "chats")
      .leftJoinAndSelect("logs.order", "order")
      .where("logs.pending = :pending", { pending: true })
      .skip((page - 1) * limit)
      .take(limit)
      .select()
      .getManyAndCount();

    return { data: logs, page, limit, total };
  }

  async updateStatus(id: number) {
    try {
      const result = await this.chatLogRepository.update(id, {
        pending: false,
      });
      if (result.affected === 1) {
        return result;
      } else {
        throw new InternalServerErrorException(
          "Error updating chat log status"
        );
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
    }
  }
}
