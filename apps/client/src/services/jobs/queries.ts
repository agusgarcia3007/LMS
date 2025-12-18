import { useQuery } from "@tanstack/react-query";
import { jobsQueryOptions, jobStatsQueryOptions } from "./options";
import type { JobsListParams } from "./service";

export function useJobs(params: JobsListParams = {}) {
  return useQuery(jobsQueryOptions(params));
}

export function useJobStats() {
  return useQuery(jobStatsQueryOptions());
}
