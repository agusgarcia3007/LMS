import { http } from "@/lib/http";

export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published";

export type Course = {
  id: string;
  tenantId: string;
  instructorId: string | null;
  slug: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  price: number;
  originalPrice: number | null;
  currency: string;
  level: CourseLevel;
  status: CourseStatus;
  modulesCount: number;
  enrollmentsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
  level?: string;
};

export type CourseListResponse = {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateCourseRequest = {
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  level?: CourseLevel;
  status?: CourseStatus;
};

export type UpdateCourseRequest = {
  id: string;
  title?: string;
  slug?: string;
  description?: string | null;
  shortDescription?: string | null;
  price?: number;
  originalPrice?: number | null;
  currency?: string;
  level?: CourseLevel;
  status?: CourseStatus;
};

export const QUERY_KEYS = {
  COURSES: ["courses"],
  COURSES_LIST: (params: CourseListParams) => ["courses", "list", params],
  COURSE: (id: string) => ["courses", id],
} as const;

export const CoursesService = {
  async list(params: CourseListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.level) searchParams.set("level", params.level);

    const queryString = searchParams.toString();
    const url = queryString ? `/courses?${queryString}` : "/courses";
    const { data } = await http.get<CourseListResponse>(url);
    return data;
  },

  async create(payload: CreateCourseRequest) {
    const { data } = await http.post<{ course: Course }>("/courses", payload);
    return data;
  },

  async update(id: string, payload: Omit<UpdateCourseRequest, "id">) {
    const { data } = await http.put<{ course: Course }>(`/courses/${id}`, payload);
    return data;
  },

  async delete(id: string) {
    const { data } = await http.delete<{ success: boolean }>(`/courses/${id}`);
    return data;
  },
} as const;
