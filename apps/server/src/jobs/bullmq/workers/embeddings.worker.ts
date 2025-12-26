import { Worker } from "bullmq";
import { connection } from "../connection";
import { db } from "@/db";
import { jobsHistoryTable, coursesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { generateEmbedding } from "@/lib/ai/embeddings";
import type { GenerateCourseEmbeddingJob } from "../../types";

type EmbeddingsJobData = { historyId: string } & GenerateCourseEmbeddingJob["data"];

async function processCourseEmbedding(data: GenerateCourseEmbeddingJob["data"]) {
  const text =
    `${data.title} ${data.shortDescription || ""} ${data.description || ""}`.trim();

  const embedding = await generateEmbedding(text);

  await db
    .update(coursesTable)
    .set({ embedding })
    .where(eq(coursesTable.id, data.courseId));

  return { courseId: data.courseId, embeddingSize: embedding.length };
}

export const embeddingsWorker = new Worker<EmbeddingsJobData>(
  "embeddings",
  async (job) => {
    const { historyId } = job.data;

    if (historyId) {
      await db
        .update(jobsHistoryTable)
        .set({ status: "processing", startedAt: new Date() })
        .where(eq(jobsHistoryTable.id, historyId));
    }

    switch (job.name) {
      case "generate-course-embedding":
        return await processCourseEmbedding(job.data);
      default:
        throw new Error(`Unknown embeddings job: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: 3,
  }
);

embeddingsWorker.on("completed", async (job) => {
  const historyId = job.data.historyId;
  if (historyId) {
    await db
      .update(jobsHistoryTable)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(jobsHistoryTable.id, historyId));
  }
  logger.info("Embeddings job completed", {
    name: job.name,
    id: job.id,
    courseId: job.data.courseId,
  });
});

embeddingsWorker.on("failed", async (job, error) => {
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
  logger.error("Embeddings job failed", {
    name: job?.name,
    courseId: job?.data.courseId,
    error: error.message,
  });
});
