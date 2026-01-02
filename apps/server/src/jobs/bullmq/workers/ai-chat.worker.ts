import { Worker } from "bullmq";
import { connection } from "../connection";
import { db } from "@/db";
import { jobsHistoryTable, aiConversationsTable, aiMessagesTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "@/lib/logger";
import type { SaveAiMessagesJob } from "../../types";

type AiChatJobData = { historyId?: string } & SaveAiMessagesJob["data"];

function generateTitle(
  messages: Array<{ role: string; content: string }>
): string {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (!firstUserMessage) return "New conversation";
  const content = firstUserMessage.content.trim();
  return content.slice(0, 100) + (content.length > 100 ? "..." : "");
}

async function processSaveMessages(data: SaveAiMessagesJob["data"]) {
  const {
    conversationId,
    tenantId,
    userId,
    conversationType,
    title,
    metadata,
    messages,
    isNewConversation,
  } = data;

  if (isNewConversation) {
    await db.insert(aiConversationsTable).values({
      id: conversationId,
      userId,
      tenantId,
      type: conversationType,
      title: title || generateTitle(messages),
      metadata,
      messageCount: messages.length,
      lastMessageAt: new Date(),
    });
  } else {
    await db
      .update(aiConversationsTable)
      .set({
        messageCount: sql`${aiConversationsTable.messageCount} + ${messages.length}`,
        lastMessageAt: new Date(),
        title: title || undefined,
      })
      .where(eq(aiConversationsTable.id, conversationId));
  }

  if (messages.length > 0) {
    await db.insert(aiMessagesTable).values(
      messages.map((msg) => ({
        conversationId,
        role: msg.role,
        content: msg.content,
        attachments: msg.attachments || null,
        toolInvocations: msg.toolInvocations || null,
      }))
    );
  }

  return {
    conversationId,
    messageCount: messages.length,
    isNewConversation,
  };
}

export const aiChatWorker = new Worker<AiChatJobData>(
  "ai-chat",
  async (job) => {
    const { historyId } = job.data;

    if (historyId) {
      await db
        .update(jobsHistoryTable)
        .set({ status: "processing", startedAt: new Date() })
        .where(eq(jobsHistoryTable.id, historyId));
    }

    switch (job.name) {
      case "save-ai-messages":
        return await processSaveMessages(job.data);
      default:
        throw new Error(`Unknown ai-chat job: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: 10,
  }
);

aiChatWorker.on("completed", async (job) => {
  const historyId = job.data.historyId;
  if (historyId) {
    await db
      .update(jobsHistoryTable)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(jobsHistoryTable.id, historyId));
  }
  logger.info("AI chat job completed", {
    name: job.name,
    id: job.id,
    conversationId: job.data.conversationId,
    messageCount: job.data.messages?.length,
  });
});

aiChatWorker.on("failed", async (job, error) => {
  const historyId = job?.data.historyId;
  if (historyId) {
    await db
      .update(jobsHistoryTable)
      .set({
        status: "failed",
        completedAt: new Date(),
        errorMessage: error.message,
      })
      .where(eq(jobsHistoryTable.id, historyId));
  }
  logger.error("AI chat job failed", {
    name: job?.name,
    conversationId: job?.data.conversationId,
    error: error.message,
  });
});
