import { redis } from "./redis";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === "string" && ISO_DATE_REGEX.test(value)) {
    return new Date(value);
  }
  return value;
}

export const redisCache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data, dateReviver) as T;
  },

  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    await redis.set(key, JSON.stringify(data));
    await redis.expire(key, ttlSeconds);
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};
