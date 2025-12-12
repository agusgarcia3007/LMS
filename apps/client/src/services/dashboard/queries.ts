import { useQuery } from "@tanstack/react-query";
import {
  dashboardStatsOptions,
  trendsOptions,
  topCoursesOptions,
  topTenantsOptions,
} from "./options";
import type { TrendPeriod } from "./service";

export const useGetDashboardStats = () => useQuery(dashboardStatsOptions);

export const useGetTrends = (period: TrendPeriod = "30d") =>
  useQuery(trendsOptions(period));

export const useGetTopCourses = (limit = 5) =>
  useQuery(topCoursesOptions(limit));

export const useGetTopTenants = (limit = 5) =>
  useQuery(topTenantsOptions(limit));
