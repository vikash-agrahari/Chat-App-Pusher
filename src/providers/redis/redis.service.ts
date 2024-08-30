import { Inject, Injectable, Optional } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Optional() @Inject('REDIS_SESSION') private readonly redisSession: Redis,
  ) {}

  isConnected() {
    return true;
  }

  /**
   * @description Set key in redis with Expiry
   * @param key
   * @param value
   * @param seconds
   * @returns
   */
  async setKeyWithExpiry(key: string, value: string, seconds: number) {
    try {
      const data = await this.redisSession.set(key, value);
      await this.setExpiry(key, seconds);
      return data;
    } catch (error) {
      console.log('Redis storage set', error, false);
      throw error;
    }
  }

  /**
   * @description Update the value of a Redis key without changing its TTL
   * @param key - The key to update
   * @param newValue - The new value to set for the key
   * @returns Promise<string> - The result of the Redis SET operation
   */
  async updateKeyWithoutChangingTTL(
    key: string,
    newValue: string,
  ): Promise<string> {
    try {
      // Fetch the current TTL of the key
      const ttl = await this.getTTlTime(key);

      if (ttl < 0) {
        throw new Error('Key does not exist or has no TTL set.');
      }

      // Update the key's value
      const result = await this.redisSession.set(key, newValue);

      // Restore the TTL
      await this.redisSession.expire(key, ttl);

      return result;
    } catch (error) {
      console.log('Redis storage update', error, false);
      throw error;
    }
  }

  /**
   * @description Get Value from Redis by key
   * @param key
   * @returns
   */
  async getKey(key: string) {
    try {
      return await this.redisSession.get(key);
    } catch (error) {
      console.log('Redis storage insertKeyInRedis', error, false);
      throw error;
    }
  }

  /**
   * @description Set Expiry for a key in redis
   * @param key
   * @param seconds
   * @returns
   */
  async setExpiry(key: string, seconds: number) {
    try {
      return await this.redisSession.expire(key, seconds);
    } catch (error) {
      console.log('Redis storage insertKeyInRedis', error, false);
      throw error;
    }
  }

  /**
   * @description Delete key from Redis
   * @param key
   * @returns
   */
  async delKey(key: string) {
    try {
      return await this.redisSession.del(key);
    } catch (error) {
      console.log('Redis storage insertKeyInRedis', error, false);
      throw error;
    }
  }

  /**
   * @description get ttl time by key
   * @param key
   * @param value
   */
  async getTTlTime(key: string) {
    try {
      return await this.redisSession.ttl(key);
    } catch (error) {
      console.log('Redis storage getTTlTime', error, false);
      throw error;
    }
  }
}
