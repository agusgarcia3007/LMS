import { queryOptions } from "@tanstack/react-query";
import { getJobs, getJobStats, QUERY_KEYS, type JobsListParams } from "./service";

export function jobsQueryOptions(params: JobsListParams) {
  return queryOptions({
    queryKey: QUERY_KEYS.jobs(params),
    queryFn: () => getJobs(params),
    refetchInterval: params.tab === "pending" ? 5000 : undefined,
  });
}

export function jobStatsQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.jobStats,
    queryFn: getJobStats,
  });
}
