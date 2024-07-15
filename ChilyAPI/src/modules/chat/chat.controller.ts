import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { DocumentationGetAllChatLogs } from "src/docs/doc-chat-module/docs-endpoints-chat";
import { DocumentationApiTagsModule } from "src/docs";

@Controller("chat")
@DocumentationApiTagsModule.clasification("Rutas para: Chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("logs")
  /*  @UseGuards(JwtAuthGuard) */
  @DocumentationGetAllChatLogs()
  async getAllChatLogs(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.chatService.findAllLogs({ page, limit });
  }
}
