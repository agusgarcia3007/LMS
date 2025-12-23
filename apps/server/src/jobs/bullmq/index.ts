import { emailWorker } from "./workers/email.worker";
import { stripeWorker } from "./workers/stripe.worker";
import { logger } from "@/lib/logger";

export async function startWorker() {
  logger.info("BullMQ workers started", {
    queues: ["emails", "stripe"],
    emailConcurrency: 5,
    stripeConcurrency: 3,
  });
}

export async function stopWorker() {
  await Promise.all([emailWorker.close(), stripeWorker.close()]);
  logger.info("BullMQ workers stopped");
}

export { enqueue } from "./enqueue";
export { bullBoardPlugin } from "./dashboard";
