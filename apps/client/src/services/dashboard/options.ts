import { queryOptions } from "@tanstack/react-query";
import { DashboardService, QUERY_KEYS, type TrendPeriod } from "./service";

export const dashboardStatsOptions = queryOptions({
  queryFn: () => DashboardService.getStats(),
  queryKey: QUERY_KEYS.STATS,
});

export const trendsOptions = (period: TrendPeriod) =>
  queryOptions({
    queryFn: () => DashboardService.getTrends(period),
    queryKey: QUERY_KEYS.TRENDS(period),
  });

export const topCoursesOptions = (limit = 5) =>
  queryOptions({
    queryFn: () => DashboardService.getTopCourses(limit),
    queryKey: QUERY_KEYS.TOP_COURSES(limit),
  });

export const topTenantsOptions = (limit = 5) =>
  queryOptions({
    queryFn: () => DashboardService.getTopTenants(limit),
    queryKey: QUERY_KEYS.TOP_TENANTS(limit),
  });
