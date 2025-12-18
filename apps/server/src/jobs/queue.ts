import { redis } from "@/lib/redis";
import { db } from "@/db";
import { jobsHistoryTable } from "@/db/schema";
import type { Job } from "./types";

const QUEUE_KEY = "jobs:queue";

export async function enqueue(job: Job): Promise<string> {
  const [record] = await db
    .insert(jobsHistoryTable)
    .values({
      jobType: job.type,
      jobData: job.data,
      status: "pending",
    })
    .returning({ id: jobsHistoryTable.id });

  await redis.lpush(QUEUE_KEY, JSON.stringify({ ...job, id: record.id }));
  return record.id;
}

export async function dequeue(): Promise<(Job & { id?: string }) | null> {
  const result = await redis.brpop(QUEUE_KEY, 5);
  if (!result) return null;
  return JSON.parse(result[1]) as Job & { id?: string };
}
