import { db } from "@/db";
import { aiConversationsTable } from "@/db/schema";
import { lte } from "drizzle-orm";
import { logger } from "@/lib/logger";

const RETENTION_DAYS = 30;
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

async function cleanupOldConversations() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

  const deleted = await db
    .delete(aiConversationsTable)
    .where(lte(aiConversationsTable.lastMessageAt, cutoffDate))
    .returning({ id: aiConversationsTable.id });

  if (deleted.length > 0) {
    logger.info("Cleaned up old AI conversations", {
      deletedCount: deleted.length,
      retentionDays: RETENTION_DAYS,
    });
  }
}

let cleanupInterval: Timer | null = null;

export function startConversationCleanup() {
  cleanupOldConversations().catch((error) => {
    logger.error("Initial conversation cleanup failed", { error });
  });

  cleanupInterval = setInterval(() => {
    cleanupOldConversations().catch((error) => {
      logger.error("Scheduled conversation cleanup failed", { error });
    });
  }, CLEANUP_INTERVAL_MS);

  cleanupInterval.unref();

  logger.info("AI conversation cleanup scheduled", {
    intervalHours: CLEANUP_INTERVAL_MS / (60 * 60 * 1000),
    retentionDays: RETENTION_DAYS,
  });
}

export function stopConversationCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
