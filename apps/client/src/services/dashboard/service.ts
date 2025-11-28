import { http } from "@/lib/http";

export type DashboardStats = {
  totalUsers: number;
  totalTenants: number;
};

export const QUERY_KEYS = {
  STATS: ["dashboard", "stats"],
} as const;

export const DashboardService = {
  async getStats() {
    const { data } = await http.get<{ stats: DashboardStats }>(
      "/backoffice/stats"
    );
    return data;
  },
} as const;
