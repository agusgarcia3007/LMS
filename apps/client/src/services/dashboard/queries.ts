import { useQuery } from "@tanstack/react-query";
import { dashboardStatsOptions } from "./options";

export const useGetDashboardStats = () => useQuery(dashboardStatsOptions);
