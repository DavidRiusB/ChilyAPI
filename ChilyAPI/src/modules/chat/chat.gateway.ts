import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { CreateMessageDto } from "./dto/message.dto";


@WebSocketGateway({
    cors: {
        origin: "*",
    }
})
export class ChatGateway  {
    constructor(
        private readonly chatService: ChatService
    ){}
    @WebSocketServer() public server: Server;
    private logger: Logger = new Logger('ChatGateway');

    async onModuleInit() {
        this.server.on('connection', (socket: Socket) => {
            const { token } = socket.handshake.query;
            // Validariamos el token con Jwtservice pero aun no lo voy a hacer para testear.

            this.logger.log('Connected: ' + socket.id);
            this.server.emit('connection', socket.id);
            socket.on('disconnect', () => {
                console.log('Disconnected: ' + socket.id);
                this.logger.log('Disconnected: ' + socket.id);
            });
        });

    }

    @SubscribeMessage('send-message')
    async handleMessage(
      @MessageBody() dataMessage: CreateMessageDto,
      @ConnectedSocket() client: Socket,
    ) {
        console.log(dataMessage);
        const { conversationId } = dataMessage;
        const message = await this.chatService.createMessage(dataMessage)
        
        this.server.to(conversationId.toString()).emit('on-message', message);
        this.server.emit('message-to', message);
    }
    @SubscribeMessage('joinRoom')
    async joinRoom(
      @MessageBody() roomId: string,
      @ConnectedSocket() client: Socket,
    ) {
        client.join(roomId);
        client.emit('joinedRoom', roomId);
        const room = this.server.sockets.adapter.rooms.get(roomId);
        const usersInRoom = room ? room.size : 0; // obtenemos los usuarios de la sala conectados
        console.log(`Usuarios conectados en la sala ${roomId}: ${usersInRoom}`);
        client.emit('usersInRoom', usersInRoom);

    }
}