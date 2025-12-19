import { beforeAll, mock } from "bun:test";
import { Elysia } from "elysia";

mock.module("elysia-rate-limit", () => ({
  rateLimit: () => new Elysia(),
}));

mock.module("@/lib/logger", () => ({
  logger: {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  },
}));

beforeAll(() => {
  process.env.NODE_ENV = "test";
});
