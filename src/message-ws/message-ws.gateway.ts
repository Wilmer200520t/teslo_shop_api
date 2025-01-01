import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly messageWsService: MessageWsService) {}

  handleConnection(client: Socket) {
    // Get the JWT token from the client that was passed as a header
    const jwtToken = client.handshake.headers.authorization;
    console.log('Client connected:', jwtToken);
    this.messageWsService.registerClient(client);
    this.server.emit('clients-online', this.messageWsService.getClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.unregisterClient(client);
    this.server.emit('clients-online', this.messageWsService.getClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessage(client: Socket, message: string) {
    // Emit the message to the client
    //client.emit('message-from-client', message);

    // Emit the message to all clients
    //this.server.emit('message-from-client', message);

    // Emit the message to all clients except the sender
    client.broadcast.emit('message-from-client', message);

    // Emit the message to a group of clients
    //this.server.to('group1').emit('message-from-client', message);

    // Emit the message to a specific client
    //this.server.to(client.id).emit('message-from-client', message);
  }
}
