import { emailWorker } from "./workers/email.worker";
import { stripeWorker } from "./workers/stripe.worker";
import { embeddingsWorker } from "./workers/embeddings.worker";
import { videoAnalysisWorker } from "./workers/video-analysis.worker";
import { aiChatWorker } from "./workers/ai-chat.worker";
import { logger } from "@/lib/logger";

export async function startWorker() {
  logger.info("BullMQ workers started", {
    queues: ["emails", "stripe", "embeddings", "video-analysis", "ai-chat"],
    emailConcurrency: 5,
    stripeConcurrency: 3,
    embeddingsConcurrency: 3,
    videoAnalysisConcurrency: 2,
    aiChatConcurrency: 10,
  });
}

export async function stopWorker() {
  await Promise.all([
    emailWorker.close(),
    stripeWorker.close(),
    embeddingsWorker.close(),
    videoAnalysisWorker.close(),
    aiChatWorker.close(),
  ]);
  logger.info("BullMQ workers stopped");
}

export { enqueue, enqueueAiMessages } from "./enqueue";
export { bullBoardPlugin } from "./dashboard";
