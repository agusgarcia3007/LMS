import Redis from "ioredis";
import { env } from "@/lib/env";

export const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
