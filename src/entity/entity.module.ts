import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database/db.module';
import { schemaProviders } from 'src/schema/schema.provider';
import { UserEntity } from './user.entity';
import { ChatEntity } from './chat.entitiy';
import { UserSessionEntity } from './user-session.entity';
import { RedisModule } from 'src/providers/redis/redis.module';
import { MessageEntity } from './message.entity';
import { Utils } from 'src/common/utils';

@Module({
  imports: [DatabaseModule, RedisModule],
  providers: [...schemaProviders, UserEntity, ChatEntity,MessageEntity, UserSessionEntity,Utils],
  exports: [UserEntity, ChatEntity, MessageEntity, UserSessionEntity],
})
export class EntityModule {}
