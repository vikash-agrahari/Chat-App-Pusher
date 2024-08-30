import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CONSTANT } from 'src/common/constant';
export interface JWTParams {
  sessionId: string;
  userId: string;
}

@Injectable()
export class GuardService {
  private readonly HASH_ALGORITHM = 'sha256';
  private readonly JWT_PASSWORD = CONSTANT.JWT_PASSWORD;

  constructor(private readonly jwtService: JwtService) {}

  public hashData(data: string, salt: string): string {
    try {
      const hmac = crypto.createHmac(this.HASH_ALGORITHM, salt);
      const hashedData = hmac.update(data).digest('hex');
      return hashedData;
    } catch (error) {
      throw new Error(`Failed to hash data: ${error.message}`);
    }
  }

  public async jwtTokenGeneration(params: JWTParams): Promise<string> {
    try {
      return this.jwtService.sign(params, {
        secret: this.JWT_PASSWORD,
        expiresIn: '30d',
      });
    } catch (error) {
      throw new Error(`Failed to generate JWT: ${error.message}`);
    }
  }
}
