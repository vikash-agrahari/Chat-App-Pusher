import { Module } from '@nestjs/common';
import { REDIS_SESSION } from './redis.provider';
import { RedisService } from './redis.service';

@Module({
    providers: [REDIS_SESSION, RedisService],
    exports: [RedisService],
})
export class RedisModule {}
