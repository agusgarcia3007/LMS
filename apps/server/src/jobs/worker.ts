import { dequeue } from "./queue";
import { processJob } from "./processors";
import { logger } from "@/lib/logger";
import { db } from "@/db";
import { jobsHistoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";

let running = true;

export async function startWorker() {
  logger.info("Job worker started");

  while (running) {
    const job = await dequeue();
    if (!job) continue;

    const jobId = job.id;

    if (jobId) {
      await db
        .update(jobsHistoryTable)
        .set({ status: "processing", startedAt: new Date() })
        .where(eq(jobsHistoryTable.id, jobId));
    }

    try {
      await processJob(job);

      if (jobId) {
        await db
          .update(jobsHistoryTable)
          .set({ status: "completed", completedAt: new Date() })
          .where(eq(jobsHistoryTable.id, jobId));
      }

      logger.info("Job completed", { type: job.type, id: jobId });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (jobId) {
        await db
          .update(jobsHistoryTable)
          .set({
            status: "failed",
            completedAt: new Date(),
            errorMessage,
          })
          .where(eq(jobsHistoryTable.id, jobId));
      }

      logger.error("Job failed", {
        type: job.type,
        id: jobId,
        error: errorMessage,
      });
    }
  }
}

export function stopWorker() {
  running = false;
}
