import { queryOptions } from "@tanstack/react-query";
import { DashboardService, QUERY_KEYS } from "./service";

export const dashboardStatsOptions = queryOptions({
  queryFn: () => DashboardService.getStats(),
  queryKey: QUERY_KEYS.STATS,
});
