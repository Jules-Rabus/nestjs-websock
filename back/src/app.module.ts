import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { MessageModule } from './messages/message.module';
import { ChatModule } from './chats/chat.module';
import { UsersModule } from './users/users.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [UsersModule, AuthModule, MessageModule, ChatModule],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    EventsGateway,
  ],
})
export class AppModule {}
