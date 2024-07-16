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
  private adminSocketId: string | null = null;

  afterInit(server: Server) {
    this.logger.log("Initialized ChatGateway");
    server.on("connection", (socket: Socket) => {
      this.logger.log(`Socket Connected: ${socket.id}`);

      socket.on("adminConnected", () => {
        this.adminSocketId = socket.id;

        this.logger.log(`Admin connected: ${socket.id}`);
      });

      socket.on("disconnect", () => {
        this.logger.log(`Disconnected: ${socket.id}`);
        if (this.adminSocketId === socket.id) {
          this.adminSocketId = null;
          this.logger.log(`Admin disconnected: ${socket.id}`);
        }
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
        this.logger.log(`Existing ChatLog found for orderId ${orderId}`);
      } catch (error) {
        if (error instanceof NotFoundException) {
          // Create a new ChatLog if not found
          chatLog = await this.chatService.createChatLog(chatData);
          this.logger.log(`New ChatLog created for orderId ${orderId}`);
        } else {
          throw error;
        }
      }
      const roomId = orderId.toString();
      client.join(roomId);
      this.logger.log(`Client ${client.id} created/joined room ${roomId}`);

      // Fetch existing messages
      const messages = await this.chatService.getMessages(chatLog.id);
      this.logger.log("messeges in chat:", messages);

      // Notify the admin about the new room
      if (this.adminSocketId) {
        this.server.to(this.adminSocketId).emit("newRoom", roomId, chatLog);
      } else {
        const errorMessage =
          "Lo sentimos, pero actualmente no podemos brindar soporte a través de este chat. Envíe su consulta a la siguiente dirección de correo electrónico: support@DondeChily.com. Le responderemos lo antes posible.";

        // Log the error message
        this.logger.log(errorMessage);
        // Send a message to the user if admin is offline
        client.emit("createRoomResponse", {
          success: false,
          roomId,
          chatLog,
          errorMessage,
        });
      }

      // Send a success response back to the client
      client.emit("createRoomResponse", {
        success: true,
        roomId,
        messages,
        chatLog,
      });
    } catch (error) {
      this.logger.error(`Error creating/joining room for orderId`, error);
      client.emit("createRoomResponse", {
        success: false,
        error: error.message,
      });
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
      try {
        const chatLog = await this.chatService.getChatLogByOrderId(orderId);
        const messages = await this.chatService.getMessages(chatLog.id);
        // Emit messages to the client after successfully joining the room
        client.emit("joinedRoom", chatLog, roomId, messages);
        // Update chat log status
        await this.chatService.updateStatus(chatLog.id);
      } catch (error) {
        if (error instanceof NotFoundException) {
          this.logger.error(`Chat log not found for orderId ${orderId}`, error);
          client.emit("error", "Chat log not found");
        } else {
          this.logger.error(
            `Error fetching messages for orderId ${orderId}`,
            error
          );
          client.emit("error", "Error fetching messages");
        }
        return; // Exit early if there's an error
      }
      const usersInRoom = room.size;
      client.emit("usersInRoom", usersInRoom);
    } else {
      client.emit("error", "Room does not exist");
    }
  }

  @SubscribeMessage("send-message")
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
      this.logger.log("on-message:", { message });
    }
  }
}
