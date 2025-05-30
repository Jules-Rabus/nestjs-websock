import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '../auth/websocket-auth.guard';

@UseGuards(WsGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private lastSeen = new Map<number, number>();

  @SubscribeMessage('userOnline')
  handleUserOnline(@MessageBody() { userId }: { userId: number }) {
    this.lastSeen.set(userId, Date.now());
    this.server.emit('userOnline', { userId });
  }

  @SubscribeMessage('userOffline')
  handleUserOffline(@MessageBody() { userId }: { userId: number }) {
    this.lastSeen.delete(userId);
    this.server.emit('userOffline', { userId });
  }

  @SubscribeMessage('userChangeColor')
  handleUserChangeColor(
    @MessageBody() { userId, color }: { userId: number; color: string },
  ) {
    this.server.emit('userChangeColor', { userId, color });
  }

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.auth.userId);
    this.lastSeen.set(userId, Date.now());
    this.server.emit('userOnline', { userId });
  }

  handleDisconnect(client: Socket) {
    const userId = Number(client.handshake.auth.userId);
    this.lastSeen.delete(userId);
    this.server.emit('userOffline', { userId });
  }

  constructor() {
    setInterval(() => {
      const now = Date.now();
      for (const [userId, ts] of this.lastSeen.entries()) {
        if (now - ts > 3 * 60 * 1000) {
          this.lastSeen.delete(userId);
          this.server.emit('userOffline', { userId });
        }
      }
    }, 60 * 1000);
  }
}
