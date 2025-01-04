import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({
  cors: true,
})
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // Get the JWT token from the client that was passed as a header
    const jwtToken = client.handshake.headers.authorization.replace(
      'Bearer ',
      '',
    );
    if (!jwtToken) {
      console.error('Client connection error: JWT token not found');
      client.disconnect();
      return;
    }

    let payload: JwtPayload;

    // Verify the JWT token
    try {
      payload = this.jwtService.verify(jwtToken);

      this.messageWsService.checktUserConnected(payload.id);

      // Register the client
      await this.messageWsService.registerClient(client, payload.id);
    } catch (e) {
      console.error('Client connection error:', jwtToken, e.message);
      client.disconnect();
      return;
    }

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
    this.server.emit('message-from-client', {
      message,
      user: this.messageWsService.getUserFullName(client),
    });

    // Emit the message to all clients except the sender
    //client.broadcast.emit('message-from-client', message);

    // Emit the message to a group of clients
    //this.server.to('group1').emit('message-from-client', message);

    // Emit the message to a specific client
    //this.server.to(client.id).emit('message-from-client', message);
  }
}
