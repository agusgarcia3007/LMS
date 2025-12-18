import { http } from "@/lib/http";

export type TenantTheme = "default" | "slate" | "rose" | "emerald" | "tangerine" | "ocean";
export type TenantMode = "light" | "dark" | "auto";

export type CustomTheme = {
  background?: string;
  foreground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  border?: string;
  fontHeading?: string;
  fontBody?: string;
};

export type TenantSocialLinks = {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
};

export type TenantFeatures = {
  analytics?: boolean;
  certificates?: boolean;
  customDomain?: boolean;
  aiAnalysis?: boolean;
  whiteLabel?: boolean;
};

export type Tenant = {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  favicon: string | null;
  theme: TenantTheme | null;
  mode: TenantMode | null;
  customDomain: string | null;
  description: string | null;
  contactEmail: string | null;
  socialLinks: TenantSocialLinks | null;
  seoTitle: string | null;
  seoDescription: string | null;
  customTheme: CustomTheme | null;
  features: TenantFeatures | null;
  status: "active" | "suspended" | "cancelled";
  plan: "starter" | "growth" | "scale" | null;
  subscriptionStatus: "trialing" | "active" | "past_due" | "canceled" | "unpaid" | null;
  trialEndsAt: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TenantStats = {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  totalCertificates: number;
  newStudents30d: number;
  newEnrollments30d: number;
};

export type TenantTrendPeriod = "7d" | "30d" | "90d";

export type TenantTrendDataPoint = {
  date: string;
  count: number;
};

export type TenantTrendsData = {
  enrollmentGrowth: TenantTrendDataPoint[];
  completionGrowth: TenantTrendDataPoint[];
  period: string;
};

export type TenantTopCourse = {
  id: string;
  title: string;
  enrollments: number;
  completionRate: number;
};

export type TenantActivity = {
  id: string;
  type: "enrollment" | "completion" | "certificate";
  userId: string;
  userName: string;
  userAvatar: string | null;
  courseId: string;
  courseName: string;
  createdAt: string;
};

export type OnboardingSteps = {
  basicInfo: boolean;
  category: boolean;
  instructor: boolean;
  module: boolean;
  course: boolean;
};

export const QUERY_KEYS = {
  TENANT: (slug: string) => ["tenants", slug] as const,
  TENANT_STATS: (id: string) => ["tenants", id, "stats"] as const,
  TENANT_ONBOARDING: (id: string) => ["tenants", id, "onboarding"] as const,
  TENANT_TRENDS: (id: string, period: TenantTrendPeriod) => ["tenants", id, "trends", period] as const,
  TENANT_TOP_COURSES: (id: string, limit: number) => ["tenants", id, "top-courses", limit] as const,
  TENANT_ACTIVITY: (id: string, limit: number) => ["tenants", id, "activity", limit] as const,
} as const;

export const TenantsService = {
  async getBySlug(slug: string) {
    const { data } = await http.get<{ tenant: Tenant }>(`/tenants/by-slug/${slug}`);
    return data;
  },

  async getStats(id: string) {
    const { data } = await http.get<{ stats: TenantStats }>(`/tenants/${id}/stats`);
    return data;
  },

  async getOnboarding(id: string) {
    const { data } = await http.get<{ steps: OnboardingSteps }>(`/tenants/${id}/onboarding`);
    return data;
  },

  async getTrends(id: string, period: TenantTrendPeriod = "30d") {
    const { data } = await http.get<{ trends: TenantTrendsData }>(
      `/tenants/${id}/stats/trends?period=${period}`
    );
    return data;
  },

  async getTopCourses(id: string, limit = 5) {
    const { data } = await http.get<{ courses: TenantTopCourse[] }>(
      `/tenants/${id}/stats/top-courses?limit=${limit}`
    );
    return data;
  },

  async getActivity(id: string, limit = 10) {
    const { data } = await http.get<{ activities: TenantActivity[] }>(
      `/tenants/${id}/stats/activity?limit=${limit}`
    );
    return data;
  },
} as const;
