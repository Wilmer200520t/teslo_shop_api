import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/users.entity';
import { Repository } from 'typeorm';

interface ConnectedClient {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClient = {};

  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, id: string) {
    const user = await this.UserRepository.findOneBy({ id });

    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User is not active');

    this.connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  unregisterClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

  getClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(client: Socket): string {
    return this.connectedClients[client.id].user.fullName;
  }

  checktUserConnected(id: string) {
    Object.keys(this.connectedClients).forEach((key) => {
      const userConneted = this.connectedClients[key];
      if (userConneted.user.id == id) {
        userConneted.socket.disconnect();
        delete this.connectedClients[key];
        return;
      }
    });
  }
}
