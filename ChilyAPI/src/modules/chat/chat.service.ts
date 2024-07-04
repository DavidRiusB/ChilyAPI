import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMessage } from "./entities/chat.entity";
import { DataSource, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { Conversations } from "./entities/conversation.entity";
import { User } from "../user/entity/user.entity";
import { CreateMessageDto } from "./dto/message.dto";

@Injectable()
export class ChatService {
    constructor(
    @InjectRepository(ChatMessage) private chatRepository: Repository<ChatMessage>,
    @InjectRepository(Conversations) private conversationRepository: Repository<Conversations>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService
) {}
    async createChat(participants: User[]) {
        const conversation = this.conversationRepository.create({ participants })
        return await this.conversationRepository.save(conversation);
    }

    async createMessage(createMessage: CreateMessageDto): Promise<ChatMessage> {
        const message = this.chatRepository.create(createMessage);
        return await this.chatRepository.save(message);
    }
    
    async getChatMessages(conversationId: number): Promise<ChatMessage[]> {
        return await this.chatRepository.find({
            where: {
                conversation: {
                    id: conversationId
                }
            },
            order: {
                createdAt: "ASC"
            }
        });
    }
}