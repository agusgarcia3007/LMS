import { http } from "@/lib/http";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type JobType =
  | "send-welcome-email"
  | "create-stripe-customer"
  | "send-tenant-welcome-email"
  | "create-connected-customer"
  | "sync-connected-customer";

export type Job = {
  id: string;
  jobType: JobType;
  jobData: Record<string, unknown>;
  status: JobStatus;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
};

export type JobStats = {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgDurationMs: number;
};

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type JobsListParams = {
  page?: number;
  limit?: number;
  tab?: "pending" | "executed";
  jobType?: JobType;
  status?: JobStatus;
};

export type JobsResponse = {
  jobs: Job[];
  pagination: PaginationInfo;
};

export type JobStatsResponse = {
  stats: JobStats;
};

export const QUERY_KEYS = {
  jobs: (params: JobsListParams) => ["jobs", params] as const,
  jobStats: ["jobs", "stats"] as const,
};

export async function getJobs(params: JobsListParams = {}): Promise<JobsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.tab) searchParams.set("tab", params.tab);
  if (params.jobType) searchParams.set("jobType", params.jobType);
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const { data } = await http.get<JobsResponse>(`/jobs${query ? `?${query}` : ""}`);
  return data;
}

export async function getJobStats(): Promise<JobStatsResponse> {
  const { data } = await http.get<JobStatsResponse>("/jobs/stats");
  return data;
}

export async function cleanupJobs(): Promise<{ deletedCount: number }> {
  const { data } = await http.delete<{ deletedCount: number }>("/jobs/cleanup");
  return data;
}
