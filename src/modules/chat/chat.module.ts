import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntityModule } from 'src/entity/entity.module';
import { GuardModule } from 'src/guards/guards.module';
import { GuardService } from 'src/guards/guards.service';
import { HttpResponse } from 'src/common/httpResponse';
import { PusherService } from 'src/providers/pusher/pusher.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [ConfigModule.forRoot(),EntityModule, GuardModule],
  controllers: [ChatController],
  providers: [ChatService, GuardService, HttpResponse, PusherService],
})
export class ChatModule {}
