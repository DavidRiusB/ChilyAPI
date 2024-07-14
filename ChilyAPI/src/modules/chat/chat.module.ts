import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { OrderModule } from "../order/order.module";
import { Chat } from "./entities/chat.entity";
import { ChatLog } from "./entities/chatLog.entity";
import { ChatController } from "./chat.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatLog]), OrderModule, UserModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
