import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CONSTANT } from 'src/common/constant';
import { RESPONSE_MSG } from 'src/common/responses';
import { UserSessionEntity } from 'src/entity/user-session.entity';
import { UserEntity } from 'src/entity/user.entity';
import {
  User,
  UserSession,
} from 'src/modules/on-boarding/interfaces/on-boarding.interface';
import { RedisService } from 'src/providers/redis/redis.service';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'userJWT') {
  constructor(
    private readonly userEntity: UserEntity,
    private readonly userSessionEntity: UserSessionEntity,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONSTANT.JWT_PASSWORD,
    });
  }

  async validate(payload: { userId: string; sessionId: string }) {
    if (payload) {
      console.log(
        '*******************   Session Validation Start For User ******************************',
      );

      // const [userData, redisSessionData] = await Promise.all([
      //   this.userEntity.getUserById(payload?.userId),
      //   this.redisService.getKey(
      //     `${CONSTANT.REDIS.KEY.SESSION}:${payload.userId}`,
      //   ),
      // ]);

      const redisSessionData = await this.redisService.getKey(
        `${CONSTANT.REDIS.KEY.SESSION}:${payload.userId}`,
      );

      let sessionData =
        typeof redisSessionData === 'string'
          ? JSON.parse(redisSessionData)
          : redisSessionData;

      if (!sessionData) {
        const [dbSessionData, userData] = await Promise.all([
          this.userSessionEntity.getUserSession(payload?.sessionId),
          this.userEntity.getUserById(payload?.userId),
        ]);

        if (!dbSessionData) {
          throw new UnauthorizedException(RESPONSE_MSG.SESSION_EXPIRED);
        }

        if (!userData)
          throw new UnauthorizedException(RESPONSE_MSG.USER_NOT_EXIST);

        sessionData = {
          _id: dbSessionData?._id,
          userId: dbSessionData?.userId,
          userData: userData
            ? {
                username: userData?.username,
                email: userData?.email,
                profileImage: userData?.profileImage,
                chats: userData?.chats,
              }
            : null,
        };
        await this.redisService.setKeyWithExpiry(
          `${CONSTANT.REDIS.KEY.SESSION}:${payload?.userId}`,
          JSON.stringify(sessionData),
          CONSTANT.REDIS.EXPIRY.SESSION_EXPIRE,
        );
      }

      if (sessionData?._id.toString() != payload?.sessionId)
        throw new UnauthorizedException(RESPONSE_MSG.SESSION_EXPIRED);

      let userData: User;

      if (!sessionData?.userData) {
        userData = await this.userEntity.getUserById(payload?.userId);
        const redisPayload = {
          ...sessionData,
          userData: {
            username: userData?.username,
            email: userData?.email,
            profileImage: userData?.profileImage,
            chats: userData?.chats,
          },
        };
        await this.redisService.updateKeyWithoutChangingTTL(
          `${CONSTANT.REDIS.KEY.SESSION}:${payload?.userId}`,
          JSON.stringify(redisPayload),
        );
      } else {
        userData = sessionData?.userData;
      }

      const sessionUser = {
        sessionId: payload.sessionId,
        userId: payload.userId,
        userData: { ...userData },
      };
      console.log(
        '*******************   Session Validation End For User ******************************',
      );

      return sessionUser;
    } else
      throw new UnauthorizedException(RESPONSE_MSG.INVALID_AUTHORIZATION_TOKEN);
  }
}
