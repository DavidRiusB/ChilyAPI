import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatMessage } from "./entities/chat.entity";
import { Conversations } from "./entities/conversation.entity";
import { UserModule } from "../user/user.module";


@Module({
    imports: [TypeOrmModule.forFeature([ChatMessage, Conversations]),
    UserModule],
    providers: [ChatService,ChatGateway]
})
export class ChatModule {}