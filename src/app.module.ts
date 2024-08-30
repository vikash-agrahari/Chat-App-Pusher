import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule, Routes } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from 'config/configuration';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './providers/database/db.module';
import { schemaProviders } from './schema/schema.provider';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/filters/exceptionFilter';
import { UserOnBoardingModule } from './modules/on-boarding/on-boarding.module';
import { PusherModule } from './providers/pusher/pusher.module';
import { ChatModule } from './modules/chat/chat.module';
import { RedisModule } from './providers/redis/redis.module';
import { MessageModule } from './modules/message/message.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

//for routing admin and app path separately
const routes: Routes = [
  {
    path: '/user',
    children: [
      {
        path: '/onboarding',
        module: UserOnBoardingModule,
      },
      {
        path: '/chat',
        module: ChatModule,
      },
      {
        path: '/message',
        module: MessageModule,
      },
      {
        path: '/file',
        module: FileUploadModule,
      },
    ],
  },
];
@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    LoggerModule,
    RouterModule.register(routes),
    UserOnBoardingModule,
    PusherModule,
    ChatModule,
    RedisModule,
    MessageModule,
    FileUploadModule
  ],
  providers: [
    ...schemaProviders,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
