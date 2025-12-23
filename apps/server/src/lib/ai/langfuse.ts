import { LangfuseClient } from "@langfuse/client";

const isProduction = Bun.env.NODE_ENV === "production";
let client: LangfuseClient | null = null;

export function getLangfuseClient(): LangfuseClient | null {
  if (!isProduction) return null;
  if (!client) {
    client = new LangfuseClient();
  }
  return client;
}
