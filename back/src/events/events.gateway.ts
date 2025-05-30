import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface MessageReadPayload {
  chatId: number;
  messageId: number;
  userId: number;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('readMessage')
  handleReadMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MessageReadPayload,
  ) {
    this.server.to(`chat_${payload.chatId}`).emit('messageRead', {
      messageId: payload.messageId,
      userId: payload.userId,
    });
  }
}
