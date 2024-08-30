import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EntityModule } from 'src/entity/entity.module';
import { GuardModule } from 'src/guards/guards.module';
import { GuardService } from 'src/guards/guards.service';
import { HttpResponse } from 'src/common/httpResponse';
import { PusherService } from 'src/providers/pusher/pusher.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [ConfigModule.forRoot(),EntityModule, GuardModule],
  controllers: [MessageController],
  providers: [MessageService, GuardService, HttpResponse, PusherService],
})
export class MessageModule {}
