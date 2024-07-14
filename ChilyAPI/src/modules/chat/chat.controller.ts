import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("logs")
  /*  @UseGuards(JwtAuthGuard) */
  async getAllChatLogs(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.chatService.findAllLogs({ page, limit });
  }
}
