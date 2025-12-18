import { redis } from "@/lib/redis";
import { db } from "@/db";
import { jobsHistoryTable } from "@/db/schema";
import type { Job } from "./types";

const QUEUE_KEY = "jobs:queue";

export async function enqueue(job: Job): Promise<string> {
  const id = crypto.randomUUID();

  await Promise.all([
    db.insert(jobsHistoryTable).values({
      id,
      jobType: job.type,
      jobData: job.data,
      status: "pending",
    }),
    redis.lpush(QUEUE_KEY, JSON.stringify({ ...job, id })),
  ]);

  return id;
}

export async function dequeue(): Promise<(Job & { id?: string }) | null> {
  const result = await redis.brpop(QUEUE_KEY, 5);
  if (!result) return null;
  return JSON.parse(result[1]) as Job & { id?: string };
}
