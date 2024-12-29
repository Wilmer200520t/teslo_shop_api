import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageWsService: MessageWsService) {}

  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    console.log(
      'Connected clients:',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.unregisterClient(client);
    console.log(
      'Connected clients:',
      this.messageWsService.getConnectedClients(),
    );
  }
}
