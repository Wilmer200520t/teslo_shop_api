import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClient {
  [id: string]: Socket;
}

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClient = {};

  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  unregisterClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }
}
