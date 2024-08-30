import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GuardService } from './guards.service';
import { BasicStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { CONSTANT } from 'src/common/constant';
import { HttpResponse } from 'src/common/httpResponse';
import { EntityModule } from 'src/entity/entity.module';
import { JwtUserStrategy } from './jwt.strategy';
import { RedisModule } from 'src/providers/redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      secret: CONSTANT.JWT_PASSWORD,
    }),
    PassportModule,
    EntityModule,
    RedisModule
  ],
  providers: [GuardService, JwtUserStrategy, HttpResponse, BasicStrategy],
  exports: [JwtModule],
})
export class GuardModule {}
