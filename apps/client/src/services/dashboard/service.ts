import { http } from "@/lib/http";

export type OverviewStats = {
  totalUsers: number;
  totalTenants: number;
  totalCourses: number;
  totalEnrollments: number;
  totalCertificates: number;
  activeUsers30d: number;
};

export type GrowthStats = {
  usersChange: number;
  tenantsChange: number;
  enrollmentsChange: number;
};

export type RevenueStats = {
  total: number;
  avgCoursePrice: number;
};

export type EngagementStats = {
  avgCompletionRate: number;
  activeEnrollments: number;
  completedEnrollments: number;
};

export type DashboardStats = {
  overview: OverviewStats;
  growth: GrowthStats;
  revenue: RevenueStats;
  engagement: EngagementStats;
};

export type TrendDataPoint = {
  date: string;
  count: number;
};

export type TrendsData = {
  userGrowth: TrendDataPoint[];
  enrollmentGrowth: TrendDataPoint[];
  certificatesIssued: TrendDataPoint[];
  period: string;
};

export type TopCourse = {
  id: string;
  title: string;
  tenantName: string | null;
  enrollments: number;
  completionRate: number;
  revenue: number;
};

export type TopTenant = {
  id: string;
  name: string;
  slug: string;
  usersCount: number;
  coursesCount: number;
  enrollmentsCount: number;
};

export type TrendPeriod = "7d" | "30d" | "90d";

export const QUERY_KEYS = {
  STATS: ["backoffice", "stats"],
  TRENDS: (period: TrendPeriod) => ["backoffice", "trends", period],
  TOP_COURSES: (limit: number) => ["backoffice", "top-courses", limit],
  TOP_TENANTS: (limit: number) => ["backoffice", "top-tenants", limit],
} as const;

export const DashboardService = {
  async getStats() {
    const { data } = await http.get<{ stats: DashboardStats }>(
      "/backoffice/stats"
    );
    return data;
  },

  async getTrends(period: TrendPeriod = "30d") {
    const { data } = await http.get<{ trends: TrendsData }>(
      `/backoffice/stats/trends?period=${period}`
    );
    return data;
  },

  async getTopCourses(limit = 5) {
    const { data } = await http.get<{ courses: TopCourse[] }>(
      `/backoffice/stats/top-courses?limit=${limit}`
    );
    return data;
  },

  async getTopTenants(limit = 5) {
    const { data } = await http.get<{ tenants: TopTenant[] }>(
      `/backoffice/stats/top-tenants?limit=${limit}`
    );
    return data;
  },
} as const;
