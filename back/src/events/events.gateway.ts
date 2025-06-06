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
import { User } from '@prisma/client';

@UseGuards(WsGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private lastSeen = new Map<number, number>();
  private lastTyping = new Map<number, { chatId: number; ts: number }>();

  @SubscribeMessage('userTyping')
  handleUserTyping(
    @MessageBody() { chatId, userId }: { chatId: number; userId: number },
  ) {
    this.lastSeen.set(userId, Date.now());
    this.server.emit('userTyping', { chatId, userId });
    this.lastTyping.set(userId, { chatId, ts: Date.now() });
    this.server.emit('userTyping', { chatId, userId });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() { chatId, userId }: { chatId: number; userId: number },
  ) {
    this.lastTyping.delete(userId);
    this.server.emit('stopTyping', { chatId, userId });
  }

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

  @SubscribeMessage('userChange')
  handleUserChange(
    @MessageBody() { userId, user }: { userId: number; user: User },
  ) {
    this.server.emit('userChange', { userId, user });
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

  // On pourrait également déplacer cette logique côté client
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

    setInterval(() => {
      const now = Date.now();
      for (const [userId, info] of this.lastTyping.entries()) {
        if (now - info.ts > 5000) {
          this.lastTyping.delete(userId);
          this.server.emit('stopTyping', { chatId: info.chatId, userId });
        }
      }
    }, 1000);
  }
}
