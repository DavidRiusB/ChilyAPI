import { Logger } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway()
export class ChatGateway  {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    async onModuleInit() {
        this.server.on('connection', (socket: Socket) => {
            console.log('Connected: ' + socket.id);
            this.logger.log('Connected: ' + socket.id);
        })
    }
}