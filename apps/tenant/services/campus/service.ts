import { publicHttp } from "@/lib/http";

export type BackgroundPattern = "none" | "grid" | "dots" | "waves";

export type CampusSocialLinks = {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
};

export type CustomTheme = {
  primary?: string | null;
  primaryDark?: string | null;
  background?: string | null;
  backgroundDark?: string | null;
  foreground?: string | null;
  foregroundDark?: string | null;
  fontBody?: string | null;
  fontHeading?: string | null;
  [key: string]: string | null | undefined;
};

export type CampusTenant = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  favicon: string | null;
  theme: string | null;
  mode: "light" | "dark" | "auto" | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroCta: string | null;
  footerText: string | null;
  heroPattern: BackgroundPattern | null;
  coursesPagePattern: BackgroundPattern | null;
  showHeaderName: boolean;
  socialLinks: CampusSocialLinks | null;
  contactEmail: string | null;
  customTheme: CustomTheme | null;
};

export type CampusInstructor = {
  name: string;
  avatar: string | null;
  title: string | null;
  bio: string | null;
};

export type CampusCourseCategory = {
  slug: string;
  name: string;
};

export type CampusCourse = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  previewVideoUrl: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  tags: string[];
  features: string[];
  requirements: string[];
  objectives: string[];
  modulesCount: number;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  categories: CampusCourseCategory[];
  instructor: CampusInstructor | null;
};

export type CampusStats = {
  totalCourses: number;
  totalStudents: number;
  categories: number;
};

export type CampusCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type CampusCourseModule = {
  id: string;
  title: string;
  description: string | null;
  itemsCount: number;
  order: number;
};

export type CampusCourseDetail = CampusCourse & {
  itemsCount: number;
  modules: CampusCourseModule[];
};

export const QUERY_KEYS = {
  CAMPUS: ["campus"],
  TENANT: ["campus", "tenant"],
  COURSES: ["campus", "courses"],
  COURSE: (slug: string) => ["campus", "courses", slug],
  STATS: ["campus", "stats"],
  CATEGORIES: ["campus", "categories"],
} as const;

export const CampusService = {
  async getTenant() {
    const { data } = await publicHttp.get<{ tenant: CampusTenant }>("/campus/tenant");
    return data;
  },

  async listCourses(params: { limit?: number; search?: string; category?: string; level?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.category) searchParams.set("category", params.category);
    if (params.level) searchParams.set("level", params.level);
    const query = searchParams.toString();
    const url = query ? `/campus/courses?${query}` : "/campus/courses";
    const { data } = await publicHttp.get<{ courses: CampusCourse[] }>(url);
    return data;
  },

  async getStats() {
    const { data } = await publicHttp.get<{ stats: CampusStats }>("/campus/stats");
    return data;
  },

  async getCategories() {
    const { data } = await publicHttp.get<{ categories: CampusCategory[] }>("/campus/categories");
    return data;
  },

  async getCourse(slug: string) {
    const { data } = await publicHttp.get<{ course: CampusCourseDetail }>(`/campus/courses/${slug}`);
    return data;
  },
} as const;
