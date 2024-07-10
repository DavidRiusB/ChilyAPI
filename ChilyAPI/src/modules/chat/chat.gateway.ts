import { Logger, NotFoundException } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { NewMessageDto } from "./dto/newMessage.dto";
import { CreateMessageDto } from "./dto/message.dto";
import { ChatLog } from "./entities/chatLog.entity";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayInit {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger("ChatGateway");

  afterInit(server: Server) {
    this.logger.log("Initialized ChatGateway");
    server.on("connection", (socket: Socket) => {
      this.logger.log(`Conected:${socket.id}}`);
      socket.on("disconnect", () => {
        this.logger.log(`Disconnected: ${socket.id}}`);
      });
    });
  }

  @SubscribeMessage("createRoom")
  async createRoom(
    @MessageBody() chatData: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const { orderId } = chatData;
      let chatLog: ChatLog;
      // Check if a ChatLog already exists for the orderId
      try {
        chatLog = await this.chatService.getChatLogByOrderId(orderId);
        console.log(chatLog);
        this.logger.log(`Existing ChatLog found for orderId ${orderId}`);
      } catch (error) {
        if (error instanceof NotFoundException) {
          // Create a new ChatLog if not found
          chatLog = await this.chatService.createChatLog(chatData);
          console.log(chatLog);
          this.logger.log(`New ChatLog created for orderId ${orderId}`);
        } else {
          throw error;
        }
      }
      const roomId = orderId.toString();
      client.join(roomId);
      this.logger.log(`Client ${client.id} created/joined room ${roomId}`);

      // Notify all clients (including admin) about the new room
      this.server.emit("newRoom", roomId);
    } catch (error) {
      this.logger.error(`Error creating/joining room for orderId`, error);
      throw error;
    }
  }

  @SubscribeMessage("joinRoom")
  async joinRoom(
    @MessageBody() orderId: number,
    @ConnectedSocket() client: Socket
  ) {
    const roomId = orderId.toString();
    const room = this.server.sockets.adapter.rooms.get(roomId);
    if (room) {
      client.join(roomId);
      this.logger.log(`Client ${client.id} joined room ${roomId}`);
      client.emit("joinedRoom", roomId);
      const usersInRoom = room.size;
      client.emit("usersInRoom", usersInRoom);
    } else {
      client.emit("error", "Room dose not exist");
    }
  }

  @SubscribeMessage("Send-message")
  async handleMessage(
    @MessageBody() dataMessage: NewMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const { chatLogId, text, userId } = dataMessage;
    const roomId = chatLogId.toString();
    const room = this.server.sockets.adapter.rooms.get(roomId);
    if (room) {
      const message = await this.chatService.createChat(
        text,
        userId,
        chatLogId
      );
      this.server.to(roomId).emit("on-message", message);
    }
  }
}
