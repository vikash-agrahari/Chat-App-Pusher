import { Injectable } from '@nestjs/common';
import { CreateOnboardingDto, LoginDto, QuerySearch } from './dto/on-boarding.dto';
import { RESPONSE_DATA } from 'src/common/responses';
import { GuardService, JWTParams } from 'src/guards/guards.service';
import { CONSTANT } from 'src/common/constant';
import { UserEntity } from 'src/entity/user.entity';
import { User, UserSession } from './interfaces/on-boarding.interface';
import { UserSessionEntity } from 'src/entity/user-session.entity';
import { SessionData } from 'src/interfaces/globle.interface';

@Injectable()
export class UserOnBoardingService {
  constructor(
    private readonly userEntity: UserEntity,
    private readonly guardService: GuardService,
    private readonly userSessionEntity: UserSessionEntity,
  ) {}

  async signUp(createOnboardingDto: CreateOnboardingDto) {
    try {
      const userData: User = await this.userEntity.getUserByEmail(
        createOnboardingDto?.email,
      );

      console.log(userData)

      if (userData) {
        return [RESPONSE_DATA.USER_ALREADY_EXIST, {}];
      }

      createOnboardingDto.password = this.guardService.hashData(
        createOnboardingDto.password,
        CONSTANT.PASSWORD_HASH_SALT,
      );

      const data: User = await this.userEntity.create(createOnboardingDto);

      const sessionData: UserSession =
        await this.userSessionEntity.createUserSession(data?._id, data);

      const tokenParams: JWTParams = {
        userId: data._id,
        sessionId: sessionData?._id,
      };

      const accessToken =
        await this.guardService.jwtTokenGeneration(tokenParams);

      return [
          RESPONSE_DATA.SUCCESS,
          {
            userId: data?._id,
            email: data?.email,
            userName: data?.username,
            profileImage: data?.profileImage,
            token: accessToken,
          },
        ];
    } catch (error) {
      console.log('Error in signUp:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const userData: User = await this.userEntity.getUserByEmail(
        loginDto?.email,
      );

      if (!userData) return [RESPONSE_DATA.USER_NOT_EXIST, {}];

      loginDto.password = this.guardService.hashData(
        loginDto.password,
        CONSTANT.PASSWORD_HASH_SALT,
      );

      if (loginDto.password === userData?.password) {
        await this.userSessionEntity.deleteUserSession(userData?._id);

        const sessionData: UserSession =
          await this.userSessionEntity.createUserSession(userData?._id, userData);

        const tokenParams: JWTParams = {
          userId: userData?._id,
          sessionId: sessionData?._id,
        };

        const accessToken =
          await this.guardService.jwtTokenGeneration(tokenParams);

        return [
          RESPONSE_DATA.SUCCESS,
          {
            userId: userData?._id,
            email: userData?.email,
            userName: userData?.username,
            profileImage: userData?.profileImage,
            token: accessToken,
          },
        ];
      } else {
        return [RESPONSE_DATA.INVALID_PASSWORD, {}];
      }
    } catch (error) {
      console.log('Error in login:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async userList(querySearch: QuerySearch, sessionData: SessionData) {
    try {
      const userList: User[] = await this.userEntity.getAllUsers(querySearch?.search, sessionData?.userId);
      return [RESPONSE_DATA.SUCCESS, userList];
    } catch (error) {
      console.log('Error in userList:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }
}
