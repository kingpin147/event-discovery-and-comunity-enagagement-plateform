import { Redis } from '@upstash/redis';
import type { SetCommandOptions } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redisClient: Redis | null = null;

if (url && token) {
  redisClient = new Redis({ url, token });
} else {
  console.warn('⚠️  Redis credentials missing. Caching disabled.');
}

export const redis = {
  async get<T>(key: string): Promise<T | null> {
    if (!redisClient) return null;
    try {
      return await redisClient.get<T>(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(
    key: string,
    value: unknown,
    options?: Pick<SetCommandOptions, 'ex'>
  ): Promise<void> {
    if (!redisClient) return;
    try {
      await redisClient.set(key, value, options as SetCommandOptions);
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  async del(key: string): Promise<void> {
    if (!redisClient) return;
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },
};
