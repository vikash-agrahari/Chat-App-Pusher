import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CONSTANT } from 'src/common/constant';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    if (username == CONSTANT.BASIC_USERNAME && password == CONSTANT.BASIC_PASSWORD) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
