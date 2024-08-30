import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { CONSTANT } from 'src/common/constant';
import { CreateOnboardingDto } from 'src/modules/on-boarding/dto/on-boarding.dto';
import {
  User,
  UserSession,
} from 'src/modules/on-boarding/interfaces/on-boarding.interface';
import { Dao } from 'src/providers/database/dao.provider';
import { RedisService } from 'src/providers/redis/redis.service';
import { IUserSession } from 'src/schema/user-session.schema';

@Injectable()
export class UserSessionEntity extends Dao {
  constructor(
    @Inject('USER_SESSION_MODEL') private userSessionModel: Model<IUserSession>,
    private redisService: RedisService,
  ) {
    super(userSessionModel);
  }

  async createUserSession(userId: string, userData: any) {
    const dataToSave = {
      userId,
    };
    const dbSessionData: UserSession = await this.saveData(dataToSave);
    const redisPayload = {
      _id: dbSessionData?._id,
      userId: dbSessionData?.userId,
      userData: userData ? {
        username: userData?.username,
        email: userData?.email,
        profileImage: userData?.profileImage,
        chats: userData?.chats,
      } : null,
    };
    if (dbSessionData) {
      await this.redisService.setKeyWithExpiry(
        `${CONSTANT.REDIS.KEY.SESSION}:${userId}`,
        JSON.stringify(redisPayload),
        CONSTANT.REDIS.EXPIRY.SESSION_EXPIRE,
      );
    }

    return dbSessionData;
  }

  async deleteUserSession(userId: string) {
    await Promise.all([
      this.redisService.delKey(`${CONSTANT.REDIS.KEY.SESSION}:${userId}`),
      this.deleteMany({ userId }),
    ]);
  }

  async getUserSession(sessionId: string) {
    const data = await this.findOne({ _id: sessionId });
    return data;
  }
}
